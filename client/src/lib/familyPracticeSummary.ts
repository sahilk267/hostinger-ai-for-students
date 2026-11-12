import { publicUrl } from "./siteUrl";
import type { GameId, LearningProgress } from "./learningProgress";

export type FamilyPracticeSnapshot = {
  gamesTried: number;
  gamesCompleted: number;
  recentGames: { id: GameId; title: string; lastPlayed: string; completions: number }[];
  nextSuggestion: { title: string; href: string; prompt: string };
  summary: string;
};

const choices: { id: GameId; title: string; href: string; prompt: string }[] = [
  { id: "pattern-builder", title: "Practise patterns together", href: "/discovery-lab?game=pattern-builder", prompt: "Ask which shape or color changes and why." },
  { id: "mini-scientist", title: "Make a tiny prediction", href: "/discovery-lab?game=mini-scientist", prompt: "Ask what might happen before choosing a result." },
  { id: "robot-programmer", title: "Plan a robot route", href: "/discovery-lab?game=robot-programmer", prompt: "Describe each instruction aloud, then revise one step." },
  { id: "fact-check-quest", title: "Check an AI claim", href: "/play?game=fact", prompt: "Find one claim and discuss which evidence would verify it." },
];

const descriptions: Partial<Record<GameId, string>> = Object.fromEntries(choices.map(x=>[x.id,x.title]));

export function buildFamilyPracticeSnapshot(progress: LearningProgress, now: Date = new Date()): FamilyPracticeSnapshot {
  const entries = Object.entries(progress) as [GameId, LearningProgress[GameId]][];
  const gamesTried = entries.filter(([,row])=>row.attempts>0).length;
  const gamesCompleted = entries.filter(([,row])=>row.completions>0).length;
  const sevenDaysAgo = now.getTime() - 7 * 86400000;
  // Only the most recent visit per game is recorded; do not claim all weekly activity is captured.
  const recentGames = entries.filter(([,row])=>{
    if (!row.lastPlayed) return false;
    const time = new Date(row.lastPlayed).getTime();
    return Number.isFinite(time) && time>=sevenDaysAgo && time<=now.getTime();
  }).sort((a,b)=>new Date(b[1].lastPlayed??0).getTime()-new Date(a[1].lastPlayed??0).getTime())
    .slice(0,6).map(([id,row])=>({id,title:descriptions[id]??id.replaceAll("-"," "),lastPlayed:row.lastPlayed!,completions:row.completions}));
  const next = choices.find(item=>progress[item.id].completions===0) ??
    [...choices].sort((a,b)=>progress[a.id].completions-progress[b.id].completions)[0];
  return {
    gamesTried, gamesCompleted, recentGames,
    nextSuggestion:{title:next.title,href:next.href,prompt:next.prompt},
    summary: !gamesTried ? "No game starts are recorded on this device. Try one short activity together." :
      recentGames.length===0 ? "Some practice is recorded, but no last-played dates fall within the past seven days." :
      "At least one activity was visited in the past seven days. Talk about what was tried, rather than treating the count as an ability score.",
  };
}

export function formatFamilySnapshot(snapshot: FamilyPracticeSnapshot): string {
  return [
    "AI FOR STUDENTS — FAMILY PRACTICE CHECK-IN",
    "Device-local practice summary. Only each game's latest recorded visit is available.",
    `Different games started: ${snapshot.gamesTried}`,
    `Different games completed: ${snapshot.gamesCompleted}`,
    snapshot.summary, "",
    "RECENTLY VISITED ACTIVITIES (LAST 7 DAYS)",
    ...(snapshot.recentGames.length ? snapshot.recentGames.map(row=>`- ${row.title}: most recent visit ${row.lastPlayed.slice(0,10)}; total recorded completions: ${row.completions}`) : ["- None recorded in this window"]),
    "", "PRACTICAL NEXT STEP", snapshot.nextSuggestion.title, snapshot.nextSuggestion.prompt,
    `Practice link: ${publicUrl(snapshot.nextSuggestion.href)}`,
    "", "Discuss: What did you try? What would you change next time?",
    "Not an assessment, diagnosis, IQ score, career prediction or full history of weekly sessions.",
    "No child's name or personal identity is included.",
  ].join("\n");
}
