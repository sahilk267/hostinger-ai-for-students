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

  it("keeps new child cloud writes and external AI coaching off unless explicitly enabled", async () => {
    const oldCloud = process.env.EXPLORER_CLOUD_SAVE_ENABLED;
    const oldAi = process.env.EXPLORER_AI_FEEDBACK_ENABLED;
    try {
      delete process.env.EXPLORER_CLOUD_SAVE_ENABLED;
      delete process.env.EXPLORER_AI_FEEDBACK_ENABLED;
      const caller = appRouter.createCaller({ req: { headers: {} }, res: {}, user: null } as never);
      expect(await caller.explorer.features()).toEqual({ cloudSaveEnabled: false, aiFeedbackEnabled: false });
      const router = source("server/routers.ts");
      expect(router).toContain('EXPLORER_CLOUD_SAVE_ENABLED !== "1"');
      expect(router).toContain('EXPLORER_AI_FEEDBACK_ENABLED !== "1"');
      const explorer = source("client/src/pages/ExplorerPage.tsx");
      expect(explorer).toContain("Cloud child-profile saving is paused");
    } finally {
      if (oldCloud === undefined) delete process.env.EXPLORER_CLOUD_SAVE_ENABLED; else process.env.EXPLORER_CLOUD_SAVE_ENABLED = oldCloud;
      if (oldAi === undefined) delete process.env.EXPLORER_AI_FEEDBACK_ENABLED; else process.env.EXPLORER_AI_FEEDBACK_ENABLED = oldAi;
    }
  });

  it("exports all account-owned Explorer data while retaining a delete route", () => {
    const db = source("server/db.ts");
    const router = source("server/routers.ts");
    const account = source("client/src/pages/AccountPage.tsx");
    expect(db).toContain("exportExplorerRecordsForAccount");
    expect(db).toContain("explorerAttempts.evidenceJson");
    expect(db).toContain("explorerShares.summaryJson");
    expect(router).toContain("explorer: await db.exportExplorerRecordsForAccount(ctx.user.id)");
    expect(router).toContain("learning: router({");
    expect(account).toContain("Browser-only guest practice is not included.");
  });

  it("invalidates views following profile deletion and prevents stale IDs", () => {
    const ui = source("client/src/pages/GuardianRecordsPage.tsx");
    const explorer = source("client/src/pages/ExplorerPage.tsx");
    expect(ui).toContain("utils.explorer.profiles.invalidate()");
    expect(ui).toContain("utils.explorer.attempts.invalidate()");
    expect(explorer).toContain("setProfileId(accountProfile?.id ?? null)");
  });
});
