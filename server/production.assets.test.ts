import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { formatHostingerPreflight, inspectHostingerEnv } from "@shared/hostingerPreflight";
import { buildDatabaseUrl, describeDatabaseConfig } from "./_core/env";

const root = resolve(import.meta.dirname, "..");
const read = (file: string) => readFileSync(resolve(root, file), "utf8");

describe("production asset and analytics contracts", () => {
  it("validates Hostinger environment presence without exposing values", () => {
    const missing = inspectHostingerEnv({});
    expect(missing.ok).toBe(false);
    expect(missing.missing).toContain("DATABASE_URL");
    expect(formatHostingerPreflight(missing)).not.toContain("secret-value");

    const placeholder = inspectHostingerEnv({
      DATABASE_URL: "mysql://user:secret-value@host/db",
      JWT_SECRET: "change-me",
      HOSTINGER_MAIL_API_TOKEN: "your-token",
      AUTH_MAIL_FROM: "auth@aiforstudents.in",
      BUILT_IN_FORGE_API_URL: "https://forge.example",
      BUILT_IN_FORGE_API_KEY: "live-api-key",
    });
    expect(placeholder.ok).toBe(false);
    expect(placeholder.placeholders).toEqual(expect.arrayContaining(["JWT_SECRET", "HOSTINGER_MAIL_API_TOKEN"]));
    expect(formatHostingerPreflight(placeholder)).not.toContain("secret-value");

    const malformedUrl = inspectHostingerEnv({
      DATABASE_URL: "127.0.0.1:3306",
      JWT_SECRET: "long-random-session-secret",
      HOSTINGER_MAIL_API_TOKEN: "long-random-mail-token",
      AUTH_MAIL_FROM: "auth@aiforstudents.in",
      BUILT_IN_FORGE_API_URL: "https://forge.example",
      BUILT_IN_FORGE_API_KEY: "long-random-forge-key",
    });
    expect(malformedUrl.ok).toBe(false);
    expect(malformedUrl.invalid).toContain("DATABASE_URL");

    const splitValid = inspectHostingerEnv({
      DATABASE_HOST: "127.0.0.1",
      DATABASE_PORT: "3306",
      DATABASE_USER: "aifs_user",
      DATABASE_PASSWORD: "long-random-db-secret",
      DATABASE_NAME: "aifs_db",
      JWT_SECRET: "long-random-session-secret",
      HOSTINGER_MAIL_API_TOKEN: "long-random-mail-token",
      AUTH_MAIL_FROM: "auth@aiforstudents.in",
      BUILT_IN_FORGE_API_URL: "https://forge.example",
      BUILT_IN_FORGE_API_KEY: "long-random-forge-key",
    });
    expect(splitValid.ok).toBe(true);

    const valid = inspectHostingerEnv({
      DATABASE_URL: "mysql://user:long-random-db-secret@host/db",
      JWT_SECRET: "long-random-session-secret",
      HOSTINGER_MAIL_API_TOKEN: "long-random-mail-token",
      AUTH_MAIL_FROM: "auth@aiforstudents.in",
      BUILT_IN_FORGE_API_URL: "https://forge.example",
      BUILT_IN_FORGE_API_KEY: "long-random-forge-key",
    });
    expect(valid.ok).toBe(true);
    expect(formatHostingerPreflight(valid)).toBe("Hostinger environment preflight passed.");

    const invalidSender = inspectHostingerEnv({ ...valid, AUTH_MAIL_FROM: "wrong@example.com" } as unknown as Record<string, string | undefined>);
    expect(invalidSender.invalid).toContain("AUTH_MAIL_FROM");
  });

  it("resolves Hostinger split database fields when DATABASE_URL is not supplied", () => {
    expect(buildDatabaseUrl({ DATABASE_URL: "mysql://explicit.example/db" })).toBe("mysql://explicit.example/db");
    expect(buildDatabaseUrl({
      DATABASE_URL: "127.0.0.1:3306",
      DATABASE_HOST: "127.0.0.1",
      DATABASE_PORT: "3306",
      DATABASE_USER: "aifs_user",
      DATABASE_PASSWORD: "secret",
      DATABASE_NAME: "aifs_db",
    })).toBe("mysql://aifs_user:secret@127.0.0.1:3306/aifs_db");
    expect(buildDatabaseUrl({ DATABASE_URL: "DATABASE_URL=mysql://aifs_user:secret@127.0.0.1:3306/aifs_db" })).toBe("mysql://aifs_user:secret@127.0.0.1:3306/aifs_db");
    expect(buildDatabaseUrl({ DATABASE_URL: '"mysql://aifs_user:secret@127.0.0.1:3306/aifs_db"' })).toBe("mysql://aifs_user:secret@127.0.0.1:3306/aifs_db");
    expect(buildDatabaseUrl({
      DATABASE_HOST: "127.0.0.1",
      DATABASE_PORT: "3306",
      DATABASE_USER: "aifs_user",
      DATABASE_PASSWORD: "p@ss word",
      DATABASE_NAME: "aifs_db",
    })).toBe("mysql://aifs_user:p%40ss%20word@127.0.0.1:3306/aifs_db");
    expect(buildDatabaseUrl({ DB_HOST: "127.0.0.1", DB_USER: "aifs_user", DB_PASSWORD: "secret" })).toBe("");
    expect(buildDatabaseUrl({ MYSQL_HOST: "db.internal", MYSQL_PORT: "3306", MYSQL_USER: "aifs_user", MYSQL_PASSWORD: "secret", MYSQL_DATABASE: "aifs_db" })).toBe("mysql://aifs_user:secret@db.internal:3306/aifs_db");
  });

  it("describes database configuration without exposing values", () => {
    expect(describeDatabaseConfig({ DATABASE_URL: "127.0.0.1:3306", DATABASE_PASSWORD: "secret" })).toEqual({ source: "DATABASE_URL", valid: false, presentKeys: ["DATABASE_URL"] });
    expect(describeDatabaseConfig({ MYSQL_HOST: "db.internal", MYSQL_USER: "aifs_user", MYSQL_PASSWORD: "secret", MYSQL_DATABASE: "aifs_db" })).toEqual({ source: "split", valid: true, presentKeys: ["MYSQL_HOST", "MYSQL_USER", "MYSQL_PASSWORD", "MYSQL_DATABASE"] });
    expect(JSON.stringify(describeDatabaseConfig({ DATABASE_PASSWORD: "secret" }))).not.toContain("secret");
  });

  it("uses deploy-safe CDN assets in the homepage and game hub", () => {
    const home = read("client/src/pages/Home.tsx");
    const games = read("client/src/pages/GamePage.tsx");
    const assets = read("client/src/lib/assets.ts");

    expect(home).toContain('import { assetUrls } from "@/lib/assets";');
    expect(games).toContain('import { assetUrls } from "@/lib/assets";');
    expect(assets).toContain("https://files.manuscdn.com/");
    expect(home).not.toContain("/manus-storage/");
    expect(games).not.toContain("/manus-storage/");
  });

  it("keeps the Hostinger handoff aligned with the server environment helper", () => {
    const handoff = read("hostinger-env-handoff.md");
    const envSource = read("server/_core/env.ts");
    for (const key of ["DATABASE_URL", "JWT_SECRET", "HOSTINGER_MAIL_API_TOKEN", "AUTH_MAIL_FROM", "BUILT_IN_FORGE_API_URL", "BUILT_IN_FORGE_API_KEY"]) {
      expect(handoff).toContain(key);
      expect(envSource).toContain(key === "DATABASE_URL" ? "env.DATABASE_URL" : `process.env.${key}`);
    }
  });

  it("keeps the Hostinger handoff secret-safe", () => {
    const handoff = read("hostinger-env-handoff.md");
    for (const key of ["DATABASE_URL", "JWT_SECRET", "HOSTINGER_MAIL_API_TOKEN", "AUTH_MAIL_FROM", "VITE_OAUTH_PORTAL_URL"]) expect(handoff).toContain(key);
    expect(handoff).toContain("never commit them to GitHub");
    expect(handoff).not.toMatch(/qwertyuiop|password123|sk-[A-Za-z0-9]{12,}|Bearer\s+[A-Za-z0-9._-]{12,}/i);
    expect(handoff).not.toContain("DATABASE_URL=mysql://");
  });

  it("states that game results are practice, not diagnosis", () => {
    const source = read("client/src/pages/GamePage.tsx");
    expect(source).toContain("Practice games—not IQ tests, diagnoses or career predictions.");
  });

  it("keeps the first game batch play-first before answer selection", () => {
    const source = read("client/src/components/game/MoreAIGames.tsx");
    expect(source).toContain('const inspectFirst = game.id === "bias-buster" || game.id === "data-detective" || game.id === "decision-studio"');
    expect(source).toContain("Reveal the clue");
    expect(source).toContain('learning_game_inspect');
    expect(source).toContain("setInspected(false)");
    expect(source).toContain('const confidenceMode = game.id === "creative-director" || game.id === "code-coach" || game.id === "tool-match"');
    expect(source).toContain('game.id === "ai-decoder" ? "match"');
    expect(source).toContain("How sure are you about that move?");
    expect(source).toContain('learning_game_confidence');
  });

  it("keeps multi-mode mechanics and final-round scoring explicit", () => {
    const source = read("client/src/components/game/MoreAIGames.tsx");
    expect(source).toContain('const mode: MultiMode = game.id === "data-detective" ? "sort"');
    expect(source).toContain("STEP 2 / BUILD THE ORDER");
    expect(source).toContain("Lock my order");
    expect(source).toContain("game-timer");
    expect(source).toContain("learning_game_timeout");
    expect(source).toContain("const finalScore = score + (currentWasCorrect ? 1 : 0)");
    expect(source).toContain("const shownScore = resultScore ?? score");
  });

  it("explains the required post-OTP Explorer save step", () => {
    const auth = read("client/src/components/LocalAuthDialog.tsx");
    const explorer = read("client/src/pages/ExplorerPage.tsx");
    expect(auth).toContain("onVerified?.()");
    expect(explorer).toContain("ONE LAST STEP / SAVE YOUR LAB");
    expect(explorer).toContain("Save profile and my progress");
    expect(explorer).toContain("Not now — keep this evidence on this device");
    expect(explorer).toContain("I am the parent/guardian and consent");
  });

  it("keeps Explorer local-evidence migration explicit and account-backed", () => {
    const explorer = read("client/src/pages/ExplorerPage.tsx");
    expect(explorer).toContain("syncLocalEvidence");
    expect(explorer).toContain("saveAttempt.mutateAsync");
    expect(explorer).toContain("Parent profile connected; completed evidence can sync.");
    expect(explorer).toContain("Sync completed evidence");
    expect(explorer).toContain("aifs-explorer-evidence-synced-");
  });

  it("keeps the blank Hostinger schema import complete and ordered", () => {
    const schema = read("hostinger-schema-import.sql");
    for (const table of ["users", "learningProgress", "explorerProfiles", "explorerAttempts", "explorerShares"]) expect(schema).toContain(`CREATE TABLE \`${table}\``);
    expect(schema).toContain("learningProgress_userId_users_id_fk");
    expect(schema).toContain("explorerProfiles_userId_users_id_fk");
    expect(schema).toContain("explorerAttempts_profileId_explorerProfiles_id_fk");
    expect(schema).toContain("explorerShares_profileId_explorerProfiles_id_fk");
    expect(schema).not.toMatch(/INSERT INTO|DROP TABLE|TRUNCATE TABLE/i);
  });

  it("keeps database diagnostics cause-only and secret-safe", () => {
    const dbSource = read("server/db.ts");
    expect(dbSource).toContain('[Database] Driver cause:');
    expect(dbSource).not.toContain('console.error("[Database] Failed query:');
    expect(dbSource).not.toContain('console.error("[Database] params:');
  });

  it("keeps deployment status truthful about pending live gates", () => {
    const status = read("hostinger-deployment-status.md");
    expect(status).toContain("53 tests pass");
    expect(status).toContain("Hostinger staging app/domain");
    expect(status).toContain("Pending");
    expect(status).toContain("No live deployment, real OTP delivery, guest-progress migration, second-device test or human pilot result is claimed");
    expect(status).not.toContain("production deployment is complete");
  });

  it("exposes meaningful Learn AI and Study with AI hubs", () => {
    const learn = read("client/src/pages/LearnPage.tsx");
    const study = read("client/src/pages/StudyPage.tsx");
    expect(learn).toContain('data-testid="learn-ai-page"');
    expect(learn).toContain("Short lessons, one useful idea at a time");
    expect(learn).toContain("Open Robotics");
    expect(study).toContain('data-testid="study-with-ai-page"');
    expect(study).toContain("Choose a workflow for the task in front of you");
    expect(study).toContain("Keep the thinking yours");
  });

  it("keeps Robotics playable, progress-backed and non-diagnostic", () => {
    const robotics = read("client/src/pages/RoboticsPage.tsx");
    const progress = read("client/src/lib/learningProgress.ts");
    const catalog = read("client/src/data/gameCatalog.ts");
    expect(robotics).toContain("Robot Route Builder");
    expect(robotics).toContain("startGame(gameId)");
    expect(robotics).toContain("completeGame(gameId");
    expect(robotics).toContain("No typing needed");
    expect(robotics).toContain("not an IQ test or a career prediction");
    expect(progress).toContain('"robotics"');
    expect(catalog).toContain('id: "robotics"');
  });

  it("keeps Explorer expansion age-banded and localized", () => {
    const explorer = read("client/src/data/explorerLab.ts");
    const copy = read("client/src/data/explorerMissionI18n.ts");
    expect(explorer).toContain('id: "robot-route-5-7"');
    expect(explorer).toContain('id: "robot-route-8-10"');
    expect(explorer).toContain('id: "robot-route-11-13"');
    expect(explorer).toContain('id: "robot-route-14-17"');
    expect(copy).toContain('"robot-route"');
    expect(copy).toContain("Robot ka route banao");
    expect(copy).toContain("रोबोट का रास्ता बनाएं");
  });

  it("keeps the favicon deploy-safe and avoids an unconditional Umami request", () => {
    const html = read("client/index.html");
    const main = read("client/src/main.tsx");

    expect(html).toContain('rel="icon"');
    expect(html).toContain("https://files.manuscdn.com/");
    expect(html).not.toContain("%VITE_ANALYTICS_ENDPOINT%/umami");
    expect(main).toContain("analyticsEndpoint && analyticsWebsiteId");
    expect(main).toContain("document.head.appendChild(analyticsScript)");
  });
});
