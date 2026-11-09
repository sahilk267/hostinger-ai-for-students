import { afterAll, beforeAll, describe, expect, it } from "vitest";
import mysql from "mysql2/promise";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  makeNewsletterChallenge, reserveNewsletterSubscription,
  confirmNewsletterSubscription,unsubscribeNewsletterSubscription,newsletterUnsubscribeToken,
} from "./newsletter";

const run=process.env.RUN_MYSQL_INTEGRATION==="1"?describe:describe.skip;
run("adult double-opt-in persistence (isolated real MySQL)",()=>{
  const uri=process.env.DATABASE_URL??"";
  if(process.env.RUN_MYSQL_INTEGRATION==="1" &&
    (!uri || !/^aifs_ci(?:_[a-z0-9_]+)?$/.test(new URL(uri).pathname.slice(1)) ||
      !["localhost","127.0.0.1"].includes(new URL(uri).hostname))) {
    throw new Error("Newsletter integration test requires a local aifs_ci database");
  }
  const priorOrigin=process.env.PUBLIC_SITE_ORIGIN;
  let connection:mysql.Connection;
  let emailKey="";
  beforeAll(async()=>{
    process.env.PUBLIC_SITE_ORIGIN="https://stage.aifs.test";
    connection=await mysql.createConnection(uri);
    const raw=readFileSync(resolve(process.cwd(),"ops/phase14-adult-newsletter.sql"),"utf8");
    const start=raw.indexOf("CREATE TABLE IF NOT EXISTS `newsletterSubscribers`");
    const end=raw.indexOf(";",start);
    if(start<0||end<0)throw Error("Newsletter staging migration missing");
    await connection.query(raw.slice(start,end+1));
  });
  afterAll(async()=>{
    if(connection){
      if(emailKey)await connection.query("DELETE FROM newsletterSubscribers WHERE emailKey=?",[emailKey]);
      await connection.end();
    }
    if(priorOrigin===undefined)delete process.env.PUBLIC_SITE_ORIGIN;
    else process.env.PUBLIC_SITE_ORIGIN=priorOrigin;
  });
  it("reserves email for adult confirmation and rejects duplicate cooldown and token replay",async()=>{
    const email="adult-test+"+Date.now()+"@example.test";
    const c=makeNewsletterChallenge(email);
    emailKey=c.emailKey;
    expect(await reserveNewsletterSubscription(c)).toBe(true);
    const again=makeNewsletterChallenge(email);
    expect(await reserveNewsletterSubscription(again)).toBe(false);
    const [pending]=await connection.query<mysql.RowDataPacket[]>(
      "SELECT confirmedAt,confirmHash,email FROM newsletterSubscribers WHERE emailKey=?", [emailKey]);
    expect(pending[0].confirmedAt).toBeNull();
    expect(pending[0].confirmHash).toBe(c.confirmHash);
    expect(pending[0].email).toBe(email);
    const token=new URL(c.confirmUrl).searchParams.get("token")!;
    expect(await confirmNewsletterSubscription(c.emailKey,token)).toBe(true);
    expect(await confirmNewsletterSubscription(c.emailKey,token)).toBe(false);
    const [active]=await connection.query<mysql.RowDataPacket[]>(
      "SELECT confirmedAt,unsubscribedAt FROM newsletterSubscribers WHERE emailKey=?",[emailKey]);
    expect(active[0].confirmedAt).not.toBeNull();
    expect(active[0].unsubscribedAt).toBeNull();
    expect(await reserveNewsletterSubscription(makeNewsletterChallenge(email))).toBe(false);
    expect(await unsubscribeNewsletterSubscription(c.emailKey,"0".repeat(64))).toBe(false);
    expect(await unsubscribeNewsletterSubscription(c.emailKey,newsletterUnsubscribeToken(c.emailKey))).toBe(true);
    const [removed]=await connection.query<mysql.RowDataPacket[]>(
      "SELECT unsubscribedAt FROM newsletterSubscribers WHERE emailKey=?",[emailKey]);
    expect(removed[0].unsubscribedAt).not.toBeNull();
    const rejoin=makeNewsletterChallenge(email,new Date(Date.now()+16*60_000));
    expect(await reserveNewsletterSubscription(rejoin)).toBe(true);
    const newToken=new URL(rejoin.confirmUrl).searchParams.get("token")!;
    expect(await confirmNewsletterSubscription(rejoin.emailKey,newToken)).toBe(true);
    const [back]=await connection.query<mysql.RowDataPacket[]>(
      "SELECT confirmedAt,unsubscribedAt FROM newsletterSubscribers WHERE emailKey=?",[emailKey]);
    expect(back[0].confirmedAt).not.toBeNull();
    expect(back[0].unsubscribedAt).toBeNull();
  });
});
