import {
  getAgeAdventureMissions,
  type AdventureAgeBand, type AdventureAttempt,
} from "./discoveryAdventure";
import { TRANSFER_CHALLENGES, type TransferAttempt } from "./discoveryTransfer";
import { buildAdventurePracticeReport } from "./discoveryReport";

export const JOURNEY_AGE_KEY="aifs-discovery-adventure-age-band";
export const JOURNEY_ATTEMPTS_KEY="aifs-discovery-adventure-v1";
export const JOURNEY_TRANSFER_KEY="aifs-discovery-transfer-v1";
export type JourneyStorage=Pick<Storage,"getItem">;

export function normalizeJourneyBand(value: unknown): AdventureAgeBand {
  return value==="8-10" || value==="11-13" || value==="14-17" ? value : "11-13";
}
function readObject(storage: JourneyStorage | undefined,key:string): Record<string,unknown> {
  if (!storage) return {};
  try {
    const parsed:unknown=JSON.parse(storage.getItem(key) || "{}");
    return parsed && typeof parsed==="object" && !Array.isArray(parsed)
      ? parsed as Record<string,unknown> : {};
  } catch { return {}; }
}
export function readSelectedJourneyBand(storage?: JourneyStorage) {
  try { return normalizeJourneyBand(storage?.getItem(JOURNEY_AGE_KEY)); }
  catch { return "11-13" as const; }
}

/** Client/browser-only data: never trust a stored object as an identity or an ability score. */
export function getBrowserJourneyReport(ageBand:AdventureAgeBand,storage?:JourneyStorage) {
  const raw=readObject(storage,JOURNEY_ATTEMPTS_KEY);
  const rawTransfer=readObject(storage,JOURNEY_TRANSFER_KEY);
  const attempts:Record<string,AdventureAttempt>={};
  const transfers:Record<string,TransferAttempt>={};
  for(const mission of getAgeAdventureMissions(ageBand)) {
    const item=raw[mission.id];
    if (!item || typeof item!=="object" || Array.isArray(item))continue;
    const row=item as Partial<AdventureAttempt>;
    if (typeof row.firstCorrect!=="boolean" || typeof row.bestCorrect!=="boolean"
      || !Number.isInteger(row.attempts) || (row.attempts??0)<1) continue;
    attempts[mission.id]={
      firstCorrect:row.firstCorrect,
      firstIndependent:row.firstIndependent===true && row.firstCorrect,
      bestCorrect:row.bestCorrect,
      attempts:Math.min(row.attempts!,1000),
      hintsUsed:Number.isInteger(row.hintsUsed) && (row.hintsUsed??0)>=0?Math.min(row.hintsUsed!,1000):0,
      enjoyed:typeof row.enjoyed==="boolean"?row.enjoyed:null,
      updatedAt:typeof row.updatedAt==="string"?row.updatedAt:"",
    };
  }
  for(const challenge of TRANSFER_CHALLENGES.filter(c=>c.band===ageBand)) {
    const item=rawTransfer[challenge.id];
    if(!item||typeof item!=="object"||Array.isArray(item))continue;
    const row=item as Partial<TransferAttempt>;
    if(!Number.isInteger(row.attempts)||(row.attempts??0)<1||
      typeof row.solved!=="boolean"||typeof row.firstCorrect!=="boolean")continue;
    transfers[challenge.id]={
      attempts:Math.min(row.attempts!,100),
      solved:row.solved,firstCorrect:row.firstCorrect && row.solved,
      firstDecisionCorrect:typeof row.firstDecisionCorrect==="boolean"?row.firstDecisionCorrect:undefined,
      firstReasonCorrect:typeof row.firstReasonCorrect==="boolean"?row.firstReasonCorrect:undefined,
      updatedAt:typeof row.updatedAt==="string"?row.updatedAt:"",
    };
  }
  return buildAdventurePracticeReport(ageBand,attempts,transfers);
}
export type BrowserJourneyReport=ReturnType<typeof getBrowserJourneyReport>;
export function nextJourneyAction(report: BrowserJourneyReport) {
  if(report.nextMission) return {href:`/explorer/adventure?age=${report.ageBand}`,label:"Continue an adventure mission"};
  if(!report.completed) return {href:`/explorer/adventure?age=${report.ageBand}`,label:"Explore the learning worlds"};
  if(!report.transfer.completed) return {href:`/explorer/adventure?age=${report.ageBand}&view=challenge`,label:"Start or continue Thinking Challenge"};
  return {href:`/explorer/adventure?age=${report.ageBand}&view=report`,label:"See your family learning milestone"};
}
