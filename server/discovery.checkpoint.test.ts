import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { CHECKPOINT_POLICY, getCheckpoints, gradeCheckpoint, type CheckpointBand, type CheckpointLocale } from "./discoveryCheckpoints";

const bands: CheckpointBand[] = ["8-10","11-13","14-17"];
const locales: CheckpointLocale[] = ["en","hi","hinglish"];
const read = (path: string) => readFileSync(resolve(process.cwd(),path),"utf8");

describe("Discovery server-only checkpoint preview", () => {
  it("serves three localized age-specific server challenges without answer fields", () => {
    const ids = new Set<string>();
    for (const band of bands) for (const locale of locales) {
      const deck = getCheckpoints(band, locale);
      expect(deck).toHaveLength(3);
      expect(new Set(deck.map(item=>item.world))).toEqual(new Set(["logic","mystery","creator"]));
      for (const challenge of deck) {
        expect(challenge.question.length).toBeGreaterThan(20);
        expect(challenge.options).toHaveLength(3);
        expect("answer" in challenge).toBe(false);
        expect("explanation" in challenge).toBe(false);
        if (locale === "en") ids.add(challenge.id);
        for (const option of challenge.options) {
          expect(option.label.length).toBeGreaterThan(3);
          expect("correct" in option).toBe(false);
        }
      }
    }
    expect(ids.size).toBe(9);
    expect(CHECKPOINT_POLICY).toBe("server-checkpoint-preview-v1");
  });

  it("grades with a server-only key and rejects cross-band or unknown answers", () => {
    for(const band of bands) for(const locale of locales){
      for(const question of getCheckpoints(band,locale)){
        const states=question.options.map(option=>gradeCheckpoint(band,question.id,option.id,locale));
        expect(states.every(Boolean)).toBe(true);
        expect(states.filter(result=>result?.correct)).toHaveLength(1);
        expect(states.every(result=>result!.explanation.length>20)).toBe(true);
        expect(gradeCheckpoint(band,question.id,"not-a-choice",locale)).toBeNull();
      }
    }
    expect(gradeCheckpoint("8-10","teen-causation","b","en")).toBeNull();
  });

  it("stays gated behind auth, flag and explicit adult self-attestation", () => {
    const router=read("server/routers.ts");
    const ui=read("client/src/pages/DiscoveryCheckpointPage.tsx");
    const schema=read("drizzle/schema.ts");
    const db=read("server/db.ts");
    expect(router).toContain('discoveryCheckpoint: router({');
    expect(router).toContain('process.env.DISCOVERY_CHECKPOINTS_ENABLED === "1"');
    expect(router).toContain('adultAcknowledged: z.literal(true)');
    expect(router).toContain('submit: protectedProcedure');
    expect(router).toContain('progress: protectedProcedure');
    expect(ui).toContain('<LocalAuthDialog');
    expect(ui).toContain('adultAcknowledged');
    expect(ui).toContain('type="checkbox"');
    expect(ui).not.toContain('setAdultAcknowledged(true)');
    expect(schema).toContain('discoveryCheckpoints_user_challenge_unique');
    expect(schema).toContain('onDelete: "cascade"');
    expect(db).toContain('deleteDiscoveryCheckpointsForAccount');
    expect(db).toContain('LEAST(');
  });

  it("retains server answer key outside all browser imports", () => {
    const keyModule=read("server/discoveryCheckpoints.ts");
    const page=read("client/src/pages/DiscoveryCheckpointPage.tsx");
    const routes=read("client/src/App.tsx");
    expect(keyModule).toContain("answer:");
    expect(page).not.toContain("from \"server/discoveryCheckpoints\"");
    expect(page).not.toContain("gradeCheckpoint(");
    expect(routes).toContain('path="/explorer/checkpoint"');
    expect(routes).toContain('lazy(() => import("./pages/DiscoveryCheckpointPage"))');
    expect(page).toContain("CHECKPOINTS_ENABLED")===false;
    expect(read("ops/discovery-checkpoint-preview.sql")).toContain("FOREIGN KEY");
  });
});
