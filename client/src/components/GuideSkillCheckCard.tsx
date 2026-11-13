import { useRef, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { guideSkillChecks, reviewGuideSkillChoice } from "@/data/guideSkillChecks";
import { trackLearningEvent } from "@/lib/analytics";

/** A practice decision, not a grade, psychological test or stored assessment. */
export default function GuideSkillCheckCard({ slug, practiceHref }: { slug: string; practiceHref: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const completedThisVisit = useRef(false);
  const check = guideSkillChecks[slug];
  if (!check) return null;
  const choice = selected === null ? null : reviewGuideSkillChoice(check, selected);

  const choose = (index: number) => {
    if (choice?.correct) return;
    const next = reviewGuideSkillChoice(check, index);
    if (!next) return;
    setSelected(index);
    if (next.correct && !completedThisVisit.current) {
      completedThisVisit.current = true;
      // Only a published guide slug, never the selected answer or free text.
      trackLearningEvent("guide_skill_check_completed", { guide: slug });
    }
  };

  return <section className="learn-path-panel" aria-labelledby="guide-skill-check-title" style={{ margin: "32px 0" }}>
    <span className="game-kicker">ONE-MINUTE PRACTICE / NO SIGN-IN</span>
    <h2 id="guide-skill-check-title">What would you do next?</h2>
    <p>{check.question}</p>
    <div className="topic-filters" role="group" aria-label="Choose your response">
      {check.choices.map((option, index) =>
        <button type="button" key={option.label} className={selected === index ? "is-active" : ""}
          aria-pressed={selected === index} disabled={choice?.correct === true}
          onClick={() => choose(index)}>
          {option.label}
        </button>)}
    </div>
    {choice && <div role="status" aria-live="polite" style={{ marginTop: 18 }}>
      <p><strong>{choice.correct ? "Useful decision." : "Consider another approach."}</strong> {choice.feedback}</p>
      {!choice.correct && <p>Choose another response when you're ready; there is no score or limit on retries.</p>}
    </div>}
    {choice?.correct && <div className="learn-card-footer" style={{ marginTop: 20 }}>
      <CheckCircle2 size={20} aria-hidden="true" />
      <a href={practiceHref} onClick={() => trackLearningEvent("guide_practice_click", { guide: slug, destination: practiceHref })}>
        Continue to the related activity <ArrowRight size={16} />
      </a>
    </div>}
    <p style={{ fontSize: "0.9rem", marginTop: 14 }}>This is a fictional learning example, not a test of ability. Your choice is not saved to an account or sent to our server.</p>
  </section>;
}
