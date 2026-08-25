import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ClipboardCheck, LockKeyhole, Share2, Sparkles, Trophy } from "lucide-react";
import { toast } from "sonner";
import AuthControls from "@/components/AuthControls";
import LocalAuthDialog from "@/components/LocalAuthDialog";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { assetUrls } from "@/lib/assets";
import {
  EXPLORER_AGE_BANDS,
  EXPLORER_PILOT_MISSIONS,
  type ExplorerAgeBand,
  type ExplorerEvidenceField,
  type ExplorerMission,
} from "@/data/explorerLab";

const STORAGE_KEY = "aifs-explorer-pilot-v1";
const ATTEMPT_KEY = "aifs-explorer-attempt-counts-v1";

type ExplorerRecord = Record<string, { completedAt: string; evidence: Partial<Record<ExplorerEvidenceField, string>> }>;

const fieldLabels: Record<ExplorerEvidenceField, string> = {
  choice: "What did you choose or decide?",
  reason: "Why did you choose it?",
  artifact: "What did you make, write, draw or arrange?",
  reflection: "What surprised you or became clearer?",
  revision: "What did you change after the clue or feedback?",
};

const fieldPlaceholders: Record<ExplorerEvidenceField, string> = {
  choice: "Write, select or describe your choice in your own words…",
  reason: "Tell us what made this choice useful for the situation…",
  artifact: "Describe the work you made. Do not paste private school details…",
  reflection: "One thing I noticed was…",
  revision: "My second try changed… because…",
};

const readAttemptCounts = (): Record<string, number> => {
  try {
    const parsed = JSON.parse(localStorage.getItem(ATTEMPT_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const readRecords = (): ExplorerRecord => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const copyShareText = async (mission: ExplorerMission) => {
  const text = `I completed “${mission.title}” in AI Explorer Lab and practiced ${mission.skill}. I am building my AI skills through real challenges—not shortcuts.`;
  try {
    if (navigator.share) {
      await navigator.share({ title: "AI Explorer Lab milestone", text });
      return;
    }
    await navigator.clipboard.writeText(text);
    toast.success("Share line copied");
  } catch {
    toast.error("Sharing was cancelled or unavailable");
  }
};

export default function ExplorerPage() {
  const [ageBand, setAgeBand] = useState<ExplorerAgeBand | null>(() => {
    const stored = localStorage.getItem("aifs-explorer-age-band");
    return stored === "5-7" || stored === "8-10" || stored === "11-13" || stored === "14-17" ? stored : null;
  });
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [records, setRecords] = useState<ExplorerRecord>(() => readRecords());
  const [attemptCounts, setAttemptCounts] = useState<Record<string, number>>(() => readAttemptCounts());
  const [evidence, setEvidence] = useState<Partial<Record<ExplorerEvidenceField, string>>>({});
  const [confirmedWork, setConfirmedWork] = useState(false);
  const [confirmedReview, setConfirmedReview] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [profileId, setProfileId] = useState<number | null>(null);
  const [profileName, setProfileName] = useState("");
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [aiFeedbackRequested, setAiFeedbackRequested] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{ encouragement: string; nextExperiment: string; reflectionQuestion: string; limitation: string } | null>(null);
  const { isAuthenticated } = useAuth();
  const profileQuery = trpc.explorer.profiles.useQuery(undefined, { enabled: isAuthenticated });
  const createProfile = trpc.explorer.createProfile.useMutation();
  const saveAttempt = trpc.explorer.saveAttempt.useMutation();
  const feedbackMutation = trpc.explorer.feedback.useMutation();

  const missions = useMemo(
    () => (ageBand ? EXPLORER_PILOT_MISSIONS.filter((item) => item.ageBand === ageBand) : []),
    [ageBand],
  );
  const mission = missions.find((item) => item.id === selectedMissionId) ?? null;
  const completedCount = missions.filter((item) => records[item.id]).length;
  const selectedRecord = mission ? records[mission.id] : undefined;
  const accountProfile = profileQuery.data?.find((item) => item.ageBand === ageBand);
  const observedSkills = useMemo(() => {
    const counts = new Map<string, number>();
    missions.filter((item) => records[item.id]).forEach((item) => counts.set(item.skill, (counts.get(item.skill) ?? 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [missions, records]);
  const shareReport = async () => {
    const topSkills = observedSkills.slice(0, 3).map(([skill]) => skill).join(", ");
    const text = `AI Explorer Lab early practice signal: I completed ${completedCount} varied missions and practiced ${topSkills}. This is a learning snapshot, not a label or prediction.`;
    try {
      if (navigator.share) await navigator.share({ title: "AI Explorer Lab practice snapshot", text });
      else { await navigator.clipboard.writeText(text); toast.success("Practice snapshot copied"); }
    } catch { toast.error("Sharing was cancelled or unavailable"); }
  };

  useEffect(() => {
    if (accountProfile) setProfileId(accountProfile.id);
  }, [accountProfile]);

  useEffect(() => {
    if (!mission) return;
    const saved = records[mission.id];
    setEvidence(saved?.evidence ?? {});
    setConfirmedWork(Boolean(saved));
    setConfirmedReview(Boolean(saved));
    setShowFeedback(Boolean(saved));
  }, [mission?.id, records]);

  const chooseAgeBand = (nextBand: ExplorerAgeBand) => {
    setAgeBand(nextBand);
    localStorage.setItem("aifs-explorer-age-band", nextBand);
    setSelectedMissionId(null);
  };

  const updateEvidence = (field: ExplorerEvidenceField, value: string) => {
    setEvidence((previous) => ({ ...previous, [field]: value }));
    setShowFeedback(false);
    setAiFeedback(null);
  };

  const saveProfile = () => {
    if (!ageBand || !profileName.trim() || !consentConfirmed) {
      toast.error("Add a display name and confirm parent consent before saving");
      return;
    }
    createProfile.mutate({ displayName: profileName.trim(), ageBand, language: "en", consentVersion: "explorer-consent-v1" }, {
      onSuccess: (profile) => {
        setProfileId(profile.id);
        toast.success("Explorer profile saved to your account");
        void profileQuery.refetch();
      },
      onError: () => toast.error("We could not save this profile yet"),
    });
  };

  const completeMission = () => {
    if (!mission) return;
    const missing = mission.evidenceFields.filter((field) => !evidence[field]?.trim());
    const totalCharacters = Object.values(evidence).join(" ").trim().length;
    if (missing.length > 0) {
      toast.error("Show your work in every required field before completing this mission");
      return;
    }
    if (totalCharacters < 30) {
      toast.error("Add a little more detail so the observation is meaningful");
      return;
    }
    if (!confirmedWork || !confirmedReview) {
      toast.error("Confirm that you did the task and reviewed your result");
      return;
    }
    const attemptNumber = Math.min(20, (attemptCounts[mission.id] ?? 0) + 1);
    const nextAttemptCounts = { ...attemptCounts, [mission.id]: attemptNumber };
    const nextRecords = {
      ...records,
      [mission.id]: { completedAt: new Date().toISOString(), evidence },
    };
    setAttemptCounts(nextAttemptCounts);
    localStorage.setItem(ATTEMPT_KEY, JSON.stringify(nextAttemptCounts));
    setRecords(nextRecords);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecords));
    if (profileId) {
      saveAttempt.mutate({ profileId, missionId: mission.id, attemptNumber, difficulty: "standard", language: "en", accessibilityMode: "standard", evidenceJson: JSON.stringify(evidence), observationJson: JSON.stringify({ skill: mission.skill, rubric: mission.rubric }), startedAt: new Date() });
      if (aiFeedbackRequested) {
        feedbackMutation.mutate({ ageBand: mission.ageBand, skill: mission.skill, objective: mission.objective, rubric: mission.rubric, evidenceJson: JSON.stringify(evidence) }, { onSuccess: setAiFeedback, onError: () => toast.error("AI coaching is unavailable; showing the practice feedback instead") });
      }
    }
    setShowFeedback(true);
    toast.success(profileId ? "Evidence saved to your account — mission complete" : "Evidence saved in this browser — mission complete");
  };

  const resetMission = () => {
    if (!mission) return;
    const nextRecords = { ...records };
    delete nextRecords[mission.id];
    setRecords(nextRecords);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecords));
    setEvidence({});
    setConfirmedWork(false);
    setConfirmedReview(false);
    setShowFeedback(false);
    toast.success("Mission reset for another attempt");
  };

  return (
    <div className="explorer-page">
      <header className="explorer-header">
        <a className="mission-brand" href="/"><img src={assetUrls.mark} alt="" /><span><strong>AI</strong> for <em>Students</em></span></a>
        <a className="mission-back" href="/"><ArrowLeft size={15} /> Back to the desk</a>
        <AuthControls />
      </header>
      <main className="explorer-main">
        <section className="explorer-hero">
          <div>
            <span className="mission-kicker"><Sparkles size={14} /> AI EXPLORER LAB · PILOT</span>
            <h1>See what you can <em>practice next.</em></h1>
            <p>Short, playful missions help learners make choices, explain thinking, revise ideas and build evidence of growth. This is an observation of practice—not a diagnosis or a prediction of who you will become.</p>
          </div>
          <div className="explorer-hero-note"><LockKeyhole size={18} /><strong>Private by default</strong><span>Your pilot evidence stays in this browser unless you choose to save or share it.</span></div>
        </section>

        {!ageBand ? (
          <section className="explorer-setup" aria-labelledby="explorer-setup-heading">
            <div className="explorer-section-heading"><span className="mission-section-label">STEP 01 / SET UP</span><h2 id="explorer-setup-heading">Who is exploring today?</h2><p>Choose an age band so the story, reading load and task length fit the learner. Age is used for design—not to rank ability.</p></div>
            <div className="explorer-age-grid">
              {EXPLORER_AGE_BANDS.map((band) => (
                <button className="explorer-age-card" type="button" key={band.id} onClick={() => chooseAgeBand(band.id)}>
                  <span>{band.id} years</span><strong>{band.label}</strong><p>{band.description}</p><small>{band.sessionLength} per mission</small><ArrowRight size={17} />
                </button>
              ))}
            </div>
            <p className="explorer-consent-note"><LockKeyhole size={15} /> For children, a parent or guardian should choose the age band, explain the activity and decide whether anything is saved or shared.</p>
          </section>
        ) : !mission ? (
          <section className="explorer-lab" aria-labelledby="explorer-missions-heading">
            <div className="explorer-lab-top"><div><span className="mission-section-label">STEP 02 / CHOOSE A MISSION</span><h2 id="explorer-missions-heading">Six ways to notice how you learn.</h2></div><button type="button" className="explorer-change-band" onClick={() => setAgeBand(null)}>Change age band</button></div>
            <div className="explorer-progress-strip"><div><strong>{completedCount} / 6</strong><span>missions completed</span></div><div className="explorer-progress-track"><span style={{ width: `${(completedCount / 6) * 100}%` }} /></div><p>Complete several different missions before treating any pattern as meaningful.</p></div>
            {isAuthenticated && !profileId ? <div className="explorer-account-save"><div><span className="mission-section-label">OPTIONAL / PARENT SAVE</span><strong>Keep this lab across devices.</strong><p>Create one parent-controlled profile for this age band. Your child can still play as a guest.</p></div><div className="explorer-account-fields"><label><span>Child display name</span><input value={profileName} onChange={(event) => setProfileName(event.target.value)} placeholder="A nickname, not a full name" maxLength={80} /></label><label className="explorer-consent-check"><input type="checkbox" checked={consentConfirmed} onChange={(event) => setConsentConfirmed(event.target.checked)} /><span>I am the parent/guardian and consent to saving this learning profile.</span></label><button type="button" className="explorer-save-profile" onClick={saveProfile} disabled={createProfile.isPending}>Save parent profile <ArrowRight size={15} /></button></div></div> : !isAuthenticated ? <div className="explorer-guest-save"><span>Playing as a guest? Evidence stays on this device.</span><LocalAuthDialog label="Sign in to save this lab" className="text-link" /></div> : <div className="explorer-guest-save"><Check size={15} /> Parent profile connected; completed evidence can sync.</div>}
            <div className="explorer-mission-grid">
              {missions.map((item, index) => {
                const done = Boolean(records[item.id]);
                return <button className={`explorer-mission-card ${done ? "is-complete" : ""}`} type="button" key={item.id} onClick={() => setSelectedMissionId(item.id)}><span className="explorer-mission-number">0{index + 1}</span><span className="explorer-mission-kind">{item.kind.replaceAll("-", " ")}</span><strong>{item.title}</strong><p>{item.objective}</p><small>{done ? <><Check size={14} /> Evidence saved</> : <><ArrowRight size={14} /> Start mission</>}</small></button>;
              })}
            </div>
            {completedCount >= 3 && <div className="explorer-report-card"><div className="explorer-report-head"><div><span className="mission-section-label">EARLY PRACTICE SNAPSHOT</span><h3>What showed up in practice.</h3></div><Trophy size={21} /></div><p className="explorer-report-disclaimer">This is a small learning snapshot from {completedCount} completed missions—not a diagnosis, personality label or career prediction.</p><div className="explorer-signal-list">{observedSkills.slice(0, 3).map(([skill, count], index) => <div key={skill}><span>0{index + 1}</span><strong>{skill}</strong><small>{count} {count === 1 ? "mission" : "missions"} with evidence</small></div>)}</div><div className="explorer-report-actions"><div><button type="button" className="explorer-share" onClick={shareReport}><Share2 size={15} /> Share practice snapshot</button><a className="explorer-report-link" href="/explorer/report">Open parent view <ArrowRight size={14} /></a></div><span>Try another context before drawing conclusions.</span></div></div>}
            <div className="explorer-method-note"><ClipboardCheck size={18} /><div><strong>How the lab works</strong><p>One mission creates one local observation. A recurring practice signal only appears after varied activities across multiple days. No single game decides a child’s ability or future.</p></div></div>
          </section>
        ) : (
          <section className="explorer-mission-view" aria-labelledby="explorer-mission-heading">
            <div className="explorer-mission-view-head"><button type="button" className="explorer-inline-back" onClick={() => setSelectedMissionId(null)}><ArrowLeft size={15} /> All missions</button><span>{mission.ageBand} years · {mission.arc}</span></div>
            <div className="explorer-mission-layout">
              <article className="explorer-challenge-card">
                <span className="mission-section-label">{mission.kind.replaceAll("-", " ")}</span><h2 id="explorer-mission-heading">{mission.title}</h2><p className="explorer-objective"><strong>Practice goal:</strong> {mission.objective}</p><div className="explorer-scenario"><span>THE SCENARIO</span><p>{mission.scenario}</p><strong>Your challenge: {mission.task}</strong></div>
                <div className="explorer-rubric"><span className="mission-section-label">LOOK FOR THESE MOVES</span>{mission.rubric.map((line, index) => <div key={line}><span>0{index + 1}</span><p>{line}</p></div>)}</div>
              </article>
              <div className="explorer-evidence-card">
                <div className="explorer-evidence-head"><div><span className="mission-section-label">STEP 03 / SHOW YOUR WORK</span><h3>{selectedRecord ? "Your evidence is saved." : "What did you actually do?"}</h3></div>{selectedRecord && <Trophy size={22} />}</div>
                <p className="explorer-evidence-intro">There is no perfect answer. Use your own words, a short description, a drawing title or a parent-supported explanation. Do not include private school, health or family details.</p>
                <div className="explorer-fields">{mission.evidenceFields.map((field) => <label key={field}><span>{fieldLabels[field]} <b>*</b></span><textarea value={evidence[field] ?? ""} onChange={(event) => updateEvidence(field, event.target.value)} placeholder={fieldPlaceholders[field]} disabled={Boolean(selectedRecord)} /></label>)}</div>
                <div className="explorer-confirmations"><label><input type="checkbox" checked={confirmedWork} onChange={(event) => setConfirmedWork(event.target.checked)} disabled={Boolean(selectedRecord)} /><span>I did the task, not just read the instructions.</span></label><label><input type="checkbox" checked={confirmedReview} onChange={(event) => setConfirmedReview(event.target.checked)} disabled={Boolean(selectedRecord)} /><span>I looked at my result and can explain one choice.</span></label>{isAuthenticated && profileId && <label><input type="checkbox" checked={aiFeedbackRequested} onChange={(event) => setAiFeedbackRequested(event.target.checked)} disabled={Boolean(selectedRecord)} /><span>Give me optional AI coaching on this attempt. It will not create a label or prediction.</span></label>}</div>
                {showFeedback && <div className="explorer-feedback"><span><Check size={16} /> {aiFeedback ? "OPTIONAL AI COACHING" : "PRACTICE FEEDBACK"}</span><strong>{aiFeedback?.encouragement ?? mission.feedback.starter}</strong><p>{aiFeedback?.nextExperiment ?? mission.feedback.nextStep}</p>{aiFeedback && <p><strong>Reflect:</strong> {aiFeedback.reflectionQuestion}</p>}<small>{aiFeedback?.limitation ?? `Observed skill: ${mission.skill} · This is not a diagnosis or future prediction.`}</small></div>}
                <div className="explorer-evidence-actions">{selectedRecord ? <><button type="button" className="explorer-reset" onClick={resetMission}>Try again</button><button type="button" className="explorer-share" onClick={() => copyShareText(mission)}><Share2 size={15} /> Share milestone</button></> : <button type="button" className="explorer-complete" onClick={completeMission}>Save evidence & complete <Check size={16} /></button>}</div>
              </div>
            </div>
          </section>
        )}
      </main>
      <footer className="mission-footer"><span>AI for Students</span><span>Practice is evidence. Labels are not.</span></footer>
    </div>
  );
}
