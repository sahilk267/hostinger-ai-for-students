import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { appRouter } from "./routers";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("Private guardian-managed Explorer record boundaries", () => {
  it("requires account authentication for private profile listing", async () => {
    const caller = appRouter.createCaller({ req: { headers: {} }, res: {}, user: null } as never);
    await expect(caller.explorer.profiles()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.explorer.attempts()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.explorer.deleteProfile({ profileId: 1 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects profile creation without explicit true adult acknowledgement", async () => {
    const caller = appRouter.createCaller({
      req: { headers: {} }, res: {},
      user: { id: 44, openId: "guardian-account", role: "user" },
    } as never);
    const input = { displayName: "Junior 1", ageBand: "8-10", language: "hi", consentVersion: "explorer-consent-v1" };
    await expect(caller.explorer.createProfile(input as never)).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.explorer.createProfile({ ...input, guardianAcknowledged: false } as never)).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("keeps management view private, non-diagnostic and deletion explicitly confirmed", () => {
    const ui = source("client/src/pages/GuardianRecordsPage.tsx");
    const app = source("client/src/App.tsx");
    const account = source("client/src/pages/AccountPage.tsx");
    expect(app).toContain('path="/guardian" component={GuardianRecordsPage}');
    expect(account).toContain('href="/guardian"');
    expect(ui).toContain("enabled: isAuthenticated");
    expect(ui).toContain("window.confirm(");
    expect(ui).toContain("remove.mutate({ profileId: id })");
    expect(ui).toContain("not guardian-verified");
    expect(ui).toContain("not a ranking or prediction");
    expect(ui).not.toContain("evidenceJson");
  });

  it("invalidates views following profile deletion and prevents stale IDs", () => {
    const ui = source("client/src/pages/GuardianRecordsPage.tsx");
    const explorer = source("client/src/pages/ExplorerPage.tsx");
    expect(ui).toContain("utils.explorer.profiles.invalidate()");
    expect(ui).toContain("utils.explorer.attempts.invalidate()");
    expect(explorer).toContain("setProfileId(accountProfile?.id ?? null)");
  });
});
