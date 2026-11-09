import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { and, eq, gt, isNull, sql } from "drizzle-orm";
import { newsletterSubscribers } from "../drizzle/schema";
import { getDb } from "./db";

const SECRET_MIN=32;
const COOLDOWN_MS=15*60_000;
const VERIFY_MS=30*60_000;
function secret() {
  const value=process.env.JWT_SECRET;
  if(!value || value.length<SECRET_MIN) throw new Error("Newsletter signing key unavailable");
  return value;
}
function hmac(purpose:string,text:string) {
  return createHmac("sha256",secret()).update(purpose+":"+text).digest("hex");
}
export function normalizeNewsletterEmail(email:string) {return email.trim().toLowerCase();}
export function emailNewsletterKey(email:string) {
  return hmac("adult-newsletter-email-v1",normalizeNewsletterEmail(email));
}
export function hashNewsletterConfirmation(key:string,token:string) {
  return hmac("adult-newsletter-confirm-v1",key+":"+token);
}
export function newsletterUnsubscribeToken(key:string) {
  return hmac("adult-newsletter-unsubscribe-v1",key);
}
export function isValidNewsletterUnsubscribeToken(key:string,token:string) {
  if(!/^[a-f0-9]{64}$/.test(key)|| !/^[a-f0-9]{64}$/.test(token))return false;
  const expected=Buffer.from(newsletterUnsubscribeToken(key),"hex");
  return timingSafeEqual(expected,Buffer.from(token,"hex"));
}
export function newsletterLink(kind:"confirm"|"unsubscribe",key:string,token:string) {
  const base=process.env.PUBLIC_SITE_ORIGIN;
  if(!base)throw new Error("Public site origin missing");
  const url=new URL(kind==="confirm"?"/newsletter/confirm":"/newsletter/unsubscribe",base);
  if(url.protocol!=="https:" && !(process.env.NODE_ENV!=="production" &&
      ["localhost","127.0.0.1"].includes(url.hostname))) {
    throw new Error("Newsletter links require HTTPS");
  }
  url.searchParams.set("key",key);
  url.searchParams.set("token",token);
  return url.toString();
}
export function makeNewsletterChallenge(email:string,now=new Date()) {
  const normalized=normalizeNewsletterEmail(email);
  const emailKey=emailNewsletterKey(normalized);
  const token=randomBytes(32).toString("base64url");
  const confirmHash=hashNewsletterConfirmation(emailKey,token);
  return {
    email:normalized,emailKey,confirmHash,
    now,expiresAt:new Date(now.getTime()+VERIFY_MS),
    confirmUrl:newsletterLink("confirm",emailKey,token),
    unsubscribeUrl:newsletterLink("unsubscribe",emailKey,newsletterUnsubscribeToken(emailKey)),
  };
}
export type NewsletterChallenge=ReturnType<typeof makeNewsletterChallenge>;

export async function reserveNewsletterSubscription(input:NewsletterChallenge) {
  const db=await getDb();
  if(!db)throw new Error("Newsletter database unavailable");
  const r=newsletterSubscribers;
  const cutoff=new Date(input.now.getTime()-COOLDOWN_MS);
  // Only pending or unsubscribed addresses can re-request. Once confirmed,
  // the same address cannot silently opt in again or reveal list membership.
  const canChange=sql`(${r.confirmedAt} IS NULL OR ${r.unsubscribedAt} IS NOT NULL)
    AND ${r.requestedAt} <= ${cutoff}`;
  await db.insert(r).values({
    emailKey:input.emailKey,email:input.email,confirmHash:input.confirmHash,
    confirmExpiresAt:input.expiresAt,requestedAt:input.now,
  }).onDuplicateKeyUpdate({set:{
    email:sql`IF(${canChange}, ${input.email}, ${r.email})`,
    confirmHash:sql`IF(${canChange}, ${input.confirmHash}, ${r.confirmHash})`,
    confirmExpiresAt:sql`IF(${canChange}, ${input.expiresAt}, ${r.confirmExpiresAt})`,
    confirmedAt:sql`IF(${canChange}, NULL, ${r.confirmedAt})`,
    requestedAt:sql`IF(${canChange}, ${input.now}, ${r.requestedAt})`,
  }});
  const rows=await db.select({confirmHash:r.confirmHash}).from(r)
    .where(eq(r.emailKey,input.emailKey)).limit(1);
  return rows[0]?.confirmHash===input.confirmHash;
}
export async function undoFailedNewsletterRequest(emailKey:string,confirmHash:string) {
  const db=await getDb();
  if(!db)throw new Error("Newsletter database unavailable");
  await db.update(newsletterSubscribers)
    .set({confirmHash:"",requestedAt:new Date(Date.now()-COOLDOWN_MS-60_000)})
    .where(and(eq(newsletterSubscribers.emailKey,emailKey),
      eq(newsletterSubscribers.confirmHash,confirmHash),isNull(newsletterSubscribers.confirmedAt)));
}
export async function confirmNewsletterSubscription(key:string,token:string) {
  if(!/^[a-f0-9]{64}$/.test(key) || !/^[A-Za-z0-9_-]{36,100}$/.test(token))return false;
  const db=await getDb();
  if(!db)throw new Error("Newsletter database unavailable");
  const r=newsletterSubscribers;
  const [changed]=await db.update(r)
    .set({confirmedAt:new Date(),unsubscribedAt:null,confirmHash:""})
    .where(and(eq(r.emailKey,key),eq(r.confirmHash,hashNewsletterConfirmation(key,token)),
      isNull(r.confirmedAt),gt(r.confirmExpiresAt,new Date())));
  return changed.affectedRows===1;
}
export async function unsubscribeNewsletterSubscription(key:string,token:string) {
  if(!isValidNewsletterUnsubscribeToken(key,token))return false;
  const db=await getDb();
  if(!db)throw new Error("Newsletter database unavailable");
  await db.update(newsletterSubscribers).set({
    unsubscribedAt:new Date(),confirmHash:"",
  }).where(eq(newsletterSubscribers.emailKey,key));
  // Do not reveal whether a subscriber exists.
  return true;
}
