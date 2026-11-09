import { describe, expect, it } from "vitest";
import { validateProductionSecurityConfig } from "./_core/runtimeSecurity";

function valid(): NodeJS.ProcessEnv {
  return {
    NODE_ENV: "production",
    JWT_SECRET: "strong-secret-for-tests-not-production-value",
    PUBLIC_SITE_ORIGIN: "https://aiforstudents.in",
    AUTH_SESSIONS_ENFORCED: "0",
    AUTH_ABUSE_DB_ENABLED: "0",
    MANUS_STORAGE_PROXY_ENABLED: "0",
    MANUS_OAUTH_SERVER_ENABLED: "0",
  };
}

describe("production runtime security fail-closed checks", () => {
  it("allows a correctly configured OTP-only production server", () => {
    expect(validateProductionSecurityConfig(valid())).toEqual([]);
  });
  it("never requires live credentials in development", () => {
    expect(validateProductionSecurityConfig({ NODE_ENV: "development" })).toEqual([]);
  });
  it("blocks weak credentials and missing or misleading public origins", () => {
    for (const origin of [
      undefined, "http://aiforstudents.in", "https://evil.test:bad@aiforstudents.in",
      "https://aiforstudents.in/path", "https://aiforstudents.in/?x=1",
      "https://aiforstudents.in.evil.test/path", "javascript:alert(1)",
    ]) {
      const env=valid();
      if (origin) env.PUBLIC_SITE_ORIGIN=origin; else delete env.PUBLIC_SITE_ORIGIN;
      env.JWT_SECRET="short";
      const codes=validateProductionSecurityConfig(env);
      expect(codes).toContain("PUBLIC_SITE_ORIGIN_INVALID");
      expect(codes).toContain("JWT_SECRET_MISSING_OR_WEAK");
      expect(JSON.stringify(codes)).not.toContain("short");
      expect(JSON.stringify(codes)).not.toContain(origin ?? "undefined");
    }
  });
  it("restricts HTTP origins to CI with explicit loopback opt-in", () => {
    const env={...valid(),PUBLIC_SITE_ORIGIN:"http://127.0.0.1:43177"};
    expect(validateProductionSecurityConfig(env)).toContain("PUBLIC_SITE_ORIGIN_INVALID");
    env.CI="true";
    env.ALLOW_INSECURE_LOOPBACK_ORIGIN_FOR_CI="1";
    expect(validateProductionSecurityConfig(env)).toEqual([]);
    env.PUBLIC_SITE_ORIGIN="http://evil.example";
    expect(validateProductionSecurityConfig(env)).toContain("PUBLIC_SITE_ORIGIN_INVALID");
  });
  it("requires a database when optional distributed security is enabled", () => {
    const env={...valid(),AUTH_SESSIONS_ENFORCED:"1"};
    expect(validateProductionSecurityConfig(env)).toContain("SECURITY_DATABASE_CONFIG_MISSING");
    env.DATABASE_URL="mysql://test:secret@localhost:3306/aifs_ci";
    expect(validateProductionSecurityConfig(env)).toEqual([]);
    delete env.DATABASE_URL;
    env.AUTH_SESSIONS_ENFORCED="0";
    env.AUTH_ABUSE_DB_ENABLED="1";
    expect(validateProductionSecurityConfig(env)).toContain("SECURITY_DATABASE_CONFIG_MISSING");
  });
  it("refuses unconfigured external OAuth and privileged storage signing", () => {
    const env={...valid(),MANUS_OAUTH_SERVER_ENABLED:"1",MANUS_STORAGE_PROXY_ENABLED:"1"};
    let codes=validateProductionSecurityConfig(env);
    expect(codes).toContain("OPTIONAL_OAUTH_PROVIDER_INVALID");
    expect(codes).toContain("STORAGE_PUBLIC_PREFIX_INVALID");
    expect(codes).toContain("STORAGE_PROVIDER_NOT_CONFIGURED");
    env.OAUTH_SERVER_URL="https://oauth.example.test";
    env.VITE_APP_ID="test-only";
    env.MANUS_STORAGE_PUBLIC_PREFIX="public/";
    env.BUILT_IN_FORGE_API_URL="https://storage.example.test";
    env.BUILT_IN_FORGE_API_KEY="test-not-real";
    codes=validateProductionSecurityConfig(env);
    expect(codes).toEqual([]);
  });
});
