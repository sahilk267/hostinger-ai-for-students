import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks=vi.hoisted(()=>({
  reserve:vi.fn(async()=>true),
  undo:vi.fn(async()=>undefined),
  confirm:vi.fn(async()=>true),
  unsubscribe:vi.fn(async()=>true),
  mail:vi.fn(async()=>undefined),
}));
vi.mock("./newsletter",()=>({
  makeNewsletterChallenge:vi.fn((email:string)=>({
    email,emailKey:"a".repeat(64),confirmHash:"b".repeat(64),
    confirmUrl:"https://aifs.test/newsletter/confirm",
    unsubscribeUrl:"https://aifs.test/newsletter/unsubscribe",
  })),
  reserveNewsletterSubscription:mocks.reserve,
  undoFailedNewsletterRequest:mocks.undo,
  confirmNewsletterSubscription:mocks.confirm,
  unsubscribeNewsletterSubscription:mocks.unsubscribe,
}));
vi.mock("./mail",()=>({
  sendAuthenticationCode:vi.fn(),
  sendContactMessage:vi.fn(async()=>undefined),
  sendNewsletterOptInEmail:mocks.mail,
}));
import { appRouter } from "./routers";
const ctx=()=>appRouter.createCaller({req:{headers:{},socket:{remoteAddress:"127.0.0.1"}},res:{},user:null} as never);
const oldSignup=process.env.NEWSLETTER_SIGNUP_ENABLED;
const oldAbuse=process.env.AUTH_ABUSE_DB_ENABLED;
beforeEach(()=>{
  process.env.NEWSLETTER_SIGNUP_ENABLED="1";
  process.env.AUTH_ABUSE_DB_ENABLED="0";
  mocks.reserve.mockReset().mockResolvedValue(true);
  mocks.undo.mockReset().mockResolvedValue(undefined);
  mocks.confirm.mockReset().mockResolvedValue(true);
  mocks.unsubscribe.mockReset().mockResolvedValue(true);
  mocks.mail.mockReset().mockResolvedValue(undefined);
});
afterEach(()=>{
  if(oldSignup===undefined)delete process.env.NEWSLETTER_SIGNUP_ENABLED;else process.env.NEWSLETTER_SIGNUP_ENABLED=oldSignup;
  if(oldAbuse===undefined)delete process.env.AUTH_ABUSE_DB_ENABLED;else process.env.AUTH_ABUSE_DB_ENABLED=oldAbuse;
});
describe("adult newsletter first-party router and safe opt-in states",()=>{
  const form={email:"adult@example.com",adultAcknowledged:true as const,consent:true as const,website:""};
  it("never accepts signups without both adult and marketing consent",async()=>{
    await expect(ctx().newsletter.request({...form,adultAcknowledged:false as never})).rejects.toMatchObject({code:"BAD_REQUEST"});
    await expect(ctx().newsletter.request({...form,consent:false as never})).rejects.toMatchObject({code:"BAD_REQUEST"});
    expect(mocks.mail).not.toHaveBeenCalled();
  });
  it("sends a confirmation only for a reserved request and returns generic receipt",async()=>{
    await expect(ctx().newsletter.request(form)).resolves.toEqual({received:true});
    expect(mocks.mail).toHaveBeenCalledWith(expect.objectContaining({to:"adult@example.com"}));
    mocks.reserve.mockResolvedValueOnce(false);
    await expect(ctx().newsletter.request(form)).resolves.toEqual({received:true});
    expect(mocks.mail).toHaveBeenCalledTimes(1);
  });
  it("keeps signups closed by default but allows opt-out after closure",async()=>{
    process.env.NEWSLETTER_SIGNUP_ENABLED="0";
    await expect(ctx().newsletter.availability()).resolves.toEqual({enabled:false});
    await expect(ctx().newsletter.request(form)).rejects.toMatchObject({code:"FORBIDDEN"});
    await expect(ctx().newsletter.unsubscribe({key:"a".repeat(64),token:"b".repeat(64)}))
      .resolves.toEqual({removed:true});
  });
  it("hides provider errors and compensates a failed confirmation delivery",async()=>{
    mocks.mail.mockRejectedValueOnce(new Error("provider secret failure"));
    await expect(ctx().newsletter.request(form)).rejects.toMatchObject({
      code:"SERVICE_UNAVAILABLE",message:"Confirmation email could not be sent",
    });
    expect(mocks.undo).toHaveBeenCalledWith("a".repeat(64),"b".repeat(64));
  });
  it("requires POST confirmation and refuses arbitrary tokens",async()=>{
    await expect(ctx().newsletter.confirm({key:"a".repeat(64),token:"Ab1_".repeat(12)}))
      .resolves.toEqual({confirmed:true});
    await expect(ctx().newsletter.confirm({key:"bad",token:"bad"})).rejects.toMatchObject({code:"BAD_REQUEST"});
    await expect(ctx().newsletter.unsubscribe({key:"a".repeat(64),token:"invalid"})).rejects.toMatchObject({code:"BAD_REQUEST"});
  });
});
