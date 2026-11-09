import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getBrowserJourneyReport, nextJourneyAction, normalizeJourneyBand, readSelectedJourneyBand } from "../client/src/data/discoveryJourney";
import { getAgeAdventureMissions } from "../client/src/data/discoveryAdventure";
import { TRANSFER_CHALLENGES } from "../client/src/data/discoveryTransfer";
const src=(path:string)=>readFileSync(resolve(process.cwd(),path),"utf8");
const storage=(entries:Record<string,string>)=>({getItem:(key:string)=>entries[key]??null});

describe("Phase 14 visible journey and parent plan",()=>{
  it("shows first-time users useful starting actions without requiring a login",()=>{
    const report=getBrowserJourneyReport("11-13",storage({}));
    expect(report).toMatchObject({attempted:0,solved:0,showcaseReady:false});
    expect(report.growthPlan).toHaveLength(3);
    expect(nextJourneyAction(report).href).toContain("/explorer/adventure");
    expect(normalizeJourneyBand("other")).toBe("11-13");
  });
  it("reads only selected band missions from local browser records and never invents a result",()=>{
    const m=getAgeAdventureMissions("8-10")[0];
    const other=getAgeAdventureMissions("14-17")[0];
    const record={firstCorrect:true,firstIndependent:true,bestCorrect:true,attempts:1,hintsUsed:0,enjoyed:null,updatedAt:"2026-11-10T00:00:00.000Z"};
    const db=storage({"aifs-discovery-adventure-age-band":"8-10",
      "aifs-discovery-adventure-v1":JSON.stringify({[m.id]:record,[other.id]:record,"unknown":record}),
      "aifs-discovery-transfer-v1":"{"});
    expect(readSelectedJourneyBand(db)).toBe("8-10");
    expect(getBrowserJourneyReport("8-10",db).solved).toBe(1);
    expect(getBrowserJourneyReport("14-17",db).solved).toBe(1);
    expect(getBrowserJourneyReport("11-13",db).solved).toBe(0);
  });
  it("shows unlocked thinking and private milestones only from completed practice",()=>{
    const missions=getAgeAdventureMissions("11-13");
    const transfers=TRANSFER_CHALLENGES.filter(c=>c.ageBand==="11-13");
    const a=Object.fromEntries(missions.map(m=>[m.id,{firstCorrect:true,firstIndependent:true,bestCorrect:true,attempts:1,hintsUsed:0,enjoyed:true,updatedAt:"2026-11-10T00:00:00.000Z"}]));
    const t=Object.fromEntries(transfers.map(q=>[q.id,{firstCorrect:true,solved:true,attempts:1,updatedAt:"2026-11-10T00:00:00.000Z"}]));
    const data=storage({"aifs-discovery-adventure-v1":JSON.stringify(a),"aifs-discovery-transfer-v1":JSON.stringify(t)});
    const result=getBrowserJourneyReport("11-13",data);
    expect(result.showcaseReady).toBe(true);
    expect(nextJourneyAction(result).href).toContain("view=report");
    expect(result.growthPlan).toHaveLength(3);
  });
  it("exposes homepage, journey, parent view, deep links and privacy limitations",()=>{
    const home=src("client/src/pages/Home.tsx");
    const app=src("client/src/App.tsx");
    const journey=src("client/src/pages/MyJourneyPage.tsx");
    const parent=src("client/src/pages/ParentsGuidePage.tsx");
    const adventure=src("client/src/pages/DiscoveryAdventurePage.tsx");
    expect(home).toContain("Start Free Adventure");
    expect(home).toContain('href="/my-journey"');
    expect(home).toContain('href="/for-parents"');
    expect(app).toContain('path="/my-journey"');
    expect(app).toContain('path="/for-parents"');
    expect(journey).toContain("<DiscoveryJourneyCard");
    expect(parent).toContain("report.growthPlan.map");
    expect(parent).toContain("No mission results yet");
    expect(adventure).toContain('get("view") === "report"');
  });
});
