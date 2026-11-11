import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { makeNewsletterChallenge, emailNewsletterKey, hashNewsletterConfirmation, newsletterUnsubscribeToken, isValidNewsletterUnsubscribeToken } from "./newsletter";

const previousSecret=process.env.JWT_SECRET;
const previousOrigin=process.env.PUBLIC_SITE_ORIGIN;
beforeEach(()=>{process.env.JWT_SECRET="CI-ONLY-NOT-REAL-32-CHAR-NEWSLETTER-SECRET";process.env.PUBLIC_SITE_ORIGIN="https://stage.aifs.test";});
afterEach(()=>{
  if(previousSecret===undefined)delete process.env.JWT_SECRET;else process.env.JWT_SECRET=previousSecret;
  if(previousOrigin===undefined)delete process.env.PUBLIC_SITE_ORIGIN;else process.env.PUBLIC_SITE_ORIGIN=previousOrigin;
});
describe("Phase 14 adult opt-in cryptographic and privacy boundaries",()=>{
  it("uses normalized HMAC identifier and one-time random confirmation secrets",()=>{
    expect(emailNewsletterKey("   Adult@Example.COM ")).toBe(emailNewsletterKey("adult@example.com"));
    const one=makeNewsletterChallenge(" ADULT@example.COM ");
    const two=makeNewsletterChallenge("adult@example.com");
    expect(one.email).toBe("adult@example.com");
    expect(one.emailKey).toMatch(/^[a-f0-9]{64}$/);
    expect(one.emailKey).toBe(two.emailKey);
    expect(one.confirmHash).not.toBe(two.confirmHash);
    expect(one.confirmHash).not.toContain("@");
    const url=new URL(one.confirmUrl);
    expect(url.origin).toBe("https://stage.aifs.test");
    expect(url.pathname).toBe("/newsletter/confirm");
    expect(url.search).not.toContain("adult%40example.com");
    expect(hashNewsletterConfirmation(one.emailKey,url.searchParams.get("token")!)).toBe(one.confirmHash);
    expect(one.expiresAt.getTime()-one.now.getTime()).toBe(30*60_000);
  });
  it("has an opaque, audience-specific unsubscribe link with constant-time validation",()=>{
    const challenge=makeNewsletterChallenge("adult@example.com");
    const unsubscribe=new URL(challenge.unsubscribeUrl);
    const token=unsubscribe.searchParams.get("token")!;
    expect(unsubscribe.pathname).toBe("/newsletter/unsubscribe");
    expect(token).toBe(newsletterUnsubscribeToken(challenge.emailKey));
    expect(isValidNewsletterUnsubscribeToken(challenge.emailKey,token)).toBe(true);
    expect(isValidNewsletterUnsubscribeToken(challenge.emailKey,"0".repeat(64))).toBe(false);
    expect(isValidNewsletterUnsubscribeToken("invalid",token)).toBe(false);
  });
  it("does not create a subscriber from the homepage alone or claim mail delivery before confirmation",()=>{
    const home=readFileSync(resolve(process.cwd(),"client/src/pages/Home.tsx"),"utf8");
    const signup=readFileSync(resolve(process.cwd(),"client/src/components/AdultNewsletterSignup.tsx"),"utf8");
    const action=readFileSync(resolve(process.cwd(),"client/src/pages/NewsletterActionPage.tsx"),"utf8");
    expect(home).not.toContain("You're on the list");
    expect(home).toContain("<AdultNewsletterSignup");
    expect(signup).toContain("newsletter.availability");
    expect(signup).toContain("newsletter.request");
    expect(signup).toContain("You are not subscribed until confirming");
    expect(action).toContain("newsletter.confirm");
    expect(action).toContain("newsletter.unsubscribe");
  });
  it("renders a real mail-delivery feedback form and keeps private child records out",()=>{
    const panel=readFileSync(resolve(process.cwd(),"client/src/components/SiteFeedbackPanel.tsx"),"utf8");
    expect(panel).toContain("trpc.contact.submit.useMutation");
    expect(panel).toContain("onSuccess:");
    expect(panel).toContain("child names, private answers");
  });
});
