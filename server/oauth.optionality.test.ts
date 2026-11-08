import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read=(file:string)=>readFileSync(resolve(process.cwd(),file),"utf8");

describe("optional Manus OAuth vs local email OTP",()=>{
  it("requires explicit frontend opt-in and valid portal + app ID",()=>{
    const code=read("client/src/const.ts");
    expect(code).toContain('VITE_MANUS_OAUTH_ENABLED !== "1"');
    expect(code).toContain('if (!isOAuthLoginConfigured()) return;');
    expect(code).toContain('url.protocol === "https:"');
  });
  it("hides unavailable OAuth from email sign-in and never falsely claims guest results were synced",()=>{
    const ui=read("client/src/components/LocalAuthDialog.tsx");
    expect(ui).toContain("isOAuthLoginConfigured() &&");
    expect(ui).toContain("guest Adventure results stay on this browser");
    expect(ui).not.toContain("Your progress is now saved.");
  });
  it("does not redirect an unauthenticated visitor to a missing external OAuth",()=>{
    const hook=read("client/src/_core/hooks/useAuth.ts");
    expect(hook).toContain("else if (isOAuthLoginConfigured())");
  });
});