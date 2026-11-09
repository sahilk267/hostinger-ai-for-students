import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { COOKIE_NAME } from "@shared/const";

const { records, upsertUser, getUserByOpenId, registerAuthSession, isAuthSessionActive, revokeAuthSession,
  spendAuthRequestBudget, sendContactMessage } = vi.hoisted(() => {
  const records = new Map<string,{userId:number;expiresAt:Date;revoked:boolean}>();
  const user = {id:42,openId:"email:ci-example",name:"Adult Test",email:"adult@example.test",role:"user",loginMethod:"email-otp"};
  return {
    records,
    upsertUser: vi.fn(async () => undefined),
    getUserByOpenId: vi.fn(async () => user),
    registerAuthSession: vi.fn(async (row:{tokenHash:string;userId:number;expiresAt:Date}) => {
      records.set(row.tokenHash,{userId:row.userId,expiresAt:row.expiresAt,revoked:false});
    }),
    isAuthSessionActive: vi.fn(async (hash:string,id:number,now=new Date()) => {
      const session=records.get(hash);
      return !!session && session.userId===id && !session.revoked && session.expiresAt>now;
    }),
    revokeAuthSession: vi.fn(async (hash:string) => {
      const row=records.get(hash);
      if(row)row.revoked=true;
    }),
    spendAuthRequestBudget: vi.fn(async () => true),
    sendContactMessage: vi.fn(async () => undefined),
  };
});
vi.mock("./db", () => ({
  getUserByOpenId, upsertUser, registerAuthSession, isAuthSessionActive, revokeAuthSession, spendAuthRequestBudget,
}));
vi.mock("./mail", () => ({sendContactMessage,sendAuthenticationCode:vi.fn()}));

import { sdk } from "./_core/sdk";
import { appRouter } from "./routers";
import { hashAuthSessionToken } from "./authSessionSecurity";

const originalSessionFlag = process.env.AUTH_SESSIONS_ENFORCED;
const originalAbuseFlag = process.env.AUTH_ABUSE_DB_ENABLED;
beforeEach(() => {
  records.clear();
  process.env.AUTH_SESSIONS_ENFORCED="1";
  process.env.AUTH_ABUSE_DB_ENABLED="0";
  getUserByOpenId.mockClear();
  upsertUser.mockClear();
  registerAuthSession.mockClear();
  isAuthSessionActive.mockClear();
  revokeAuthSession.mockClear();
  spendAuthRequestBudget.mockReset().mockResolvedValue(true);
  sendContactMessage.mockClear();
});
afterEach(() => {
  if(originalSessionFlag===undefined)delete process.env.AUTH_SESSIONS_ENFORCED;
  else process.env.AUTH_SESSIONS_ENFORCED=originalSessionFlag;
  if(originalAbuseFlag===undefined)delete process.env.AUTH_ABUSE_DB_ENABLED;
  else process.env.AUTH_ABUSE_DB_ENABLED=originalAbuseFlag;
});

function req(token?:string) {
  return {protocol:"https",method:"POST",socket:{remoteAddress:"127.0.0.1"},
    headers:token?{cookie:`${COOKIE_NAME}=${token}`}:{}} as never;
}
function context(token?:string) {
  const res={cookie:vi.fn(),clearCookie:vi.fn()};
  const ctx={req:req(token),res,user:null} as never;
  return {ctx,res};
}

describe("enforced session lifecycle and authenticated route budgets", () => {
  it("issues independently revocable, unique tokens even twice in the same second", async () => {
    const first=await sdk.createSessionToken("email:ci-example",{name:"Adult Test",expiresInMs:3600_000});
    const second=await sdk.createSessionToken("email:ci-example",{name:"Adult Test",expiresInMs:3600_000});
    expect(first).not.toEqual(second);
    expect(records.size).toBe(2);
    const firstDigest=hashAuthSessionToken(first);
    const secondDigest=hashAuthSessionToken(second);
    expect(firstDigest).not.toEqual(secondDigest);
    await revokeAuthSession(firstDigest);
    await expect(sdk.authenticateRequest(req(first))).rejects.toThrow(/revoked/i);
    expect(await sdk.authenticateRequest(req(second))).toMatchObject({id:42});
  });

  it("stores only a token digest; live cookie authenticates, logout revokes across future requests", async () => {
    const token=await sdk.createSessionToken("email:ci-example",{name:"Adult Test",expiresInMs:3600_000});
    expect(registerAuthSession).toHaveBeenCalledTimes(1);
    expect(registerAuthSession.mock.calls[0][0].tokenHash).toBe(hashAuthSessionToken(token));
    expect(records.size).toBe(1);
    expect([...records.keys()][0]).not.toBe(token);
    const authenticated=await sdk.authenticateRequest(req(token));
    expect(authenticated).toMatchObject({id:42,openId:"email:ci-example"});
    expect(isAuthSessionActive).toHaveBeenCalledWith(hashAuthSessionToken(token),42);
    const {ctx,res}=context(token);
    await expect(appRouter.createCaller(ctx).auth.logout()).resolves.toEqual({success:true});
    expect(res.clearCookie).toHaveBeenCalledWith(COOKIE_NAME,expect.objectContaining({secure:true,httpOnly:true}));
    expect(revokeAuthSession).toHaveBeenCalledWith(hashAuthSessionToken(token));
    await expect(sdk.authenticateRequest(req(token))).rejects.toThrow(/revoked/i);
    const fresh=await sdk.createSessionToken("email:ci-example",{name:"Adult Test",expiresInMs:3600_000});
    expect(await sdk.authenticateRequest(req(fresh))).toMatchObject({id:42});
  });
  it("refuses untracked and expired JWTs when enforcement is on", async () => {
    const token=await sdk.createSessionToken("email:ci-example",{name:"Adult Test",expiresInMs:3600_000});
    const hash=hashAuthSessionToken(token);
    records.delete(hash);
    await expect(sdk.authenticateRequest(req(token))).rejects.toThrow(/revoked/i);
    records.set(hash,{userId:42,expiresAt:new Date(Date.now()-60_000),revoked:false});
    await expect(sdk.authenticateRequest(req(token))).rejects.toThrow(/revoked/i);
  });
  it("fails logout with an error, but clears local cookie when database revocation fails", async () => {
    const token=await sdk.createSessionToken("email:ci-example",{name:"Adult Test",expiresInMs:3600_000});
    const {ctx,res}=context(token);
    revokeAuthSession.mockRejectedValueOnce(new Error("private database details"));
    await expect(appRouter.createCaller(ctx).auth.logout()).rejects.toMatchObject({
      code:"SERVICE_UNAVAILABLE",message:"Could not revoke session; please try again",
    });
    expect(res.clearCookie).toHaveBeenCalled();
  });
  it("blocks excess contact submissions before sending mail, and hides database errors", async () => {
    process.env.AUTH_ABUSE_DB_ENABLED="1";
    const {ctx}=context();
    spendAuthRequestBudget.mockResolvedValueOnce(false);
    await expect(appRouter.createCaller(ctx).contact.submit({
      name:"Adult Test",replyEmail:"adult@example.test",subject:"Question",message:"Hello",
    })).rejects.toMatchObject({code:"TOO_MANY_REQUESTS"});
    expect(sendContactMessage).not.toHaveBeenCalled();
    spendAuthRequestBudget.mockRejectedValueOnce(new Error("private database details"));
    await expect(appRouter.createCaller(ctx).contact.submit({
      name:"Adult Test",replyEmail:"adult@example.test",subject:"Question",message:"Hello",
    })).rejects.toMatchObject({code:"SERVICE_UNAVAILABLE",message:"Request safety service unavailable"});
    expect(sendContactMessage).not.toHaveBeenCalled();
  });
});
