import CompletionNextSteps from "@/components/game/CompletionNextSteps";
/* Study Desk Editorial game: tactile evidence cards, saffron signals, clear feedback and no pressure mechanics. */
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { GameLesson, GameQuestion, lessons, questions } from "@/data/gameQuestions";
import { completeGame, startGame } from "@/lib/learningProgress";
import { trackLearningEvent } from "@/lib/analytics";
import { createRoundSeed, orderChoices } from "@/lib/answerOrder";
import PostGameFeedback from "@/components/game/PostGameFeedback";
import ShareResult from "@/components/game/ShareResult";

const STORAGE_KEY = "ai-students-prompt-detective-best";

function loadBest() {
  if (typeof window === "undefined") return 0;
  return Number(window.localStorage.getItem(STORAGE_KEY) || 0);
}

function saveBest(score: number) {
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, String(score));
}

function pickQuestions(lesson: GameLesson) {
  const matching = questions.filter((question) => question.lesson === lesson);
  const supporting = questions.filter((question) => question.lesson !== lesson);
  return [...matching, ...supporting];
}

export default function PromptDetective() {
  const [lesson, setLesson] = useState<GameLesson | null>(null);
  const [round, setRound] = useState<GameQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [best, setBest] = useState(loadBest);
  const [roundSeed, setRoundSeed] = useState(() => createRoundSeed());

  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("demo")) start("clarity");
  }, []);

  const current = round[index];
  const orderedChoices = current ? orderChoices(current.choices, roundSeed, current.id) : [];
  const progress = round.length ? ((index + (selected ? 1 : 0)) / round.length) * 100 : 0;
  const correctChoice = orderedChoices.find((choice) => choice.correct);

  const start = (selectedLesson: GameLesson) => {
    setLesson(selectedLesson);
    startGame("prompt-detective");
    trackLearningEvent("learning_game_start", { game: "prompt-detective", lesson: selectedLesson });
    setRound(pickQuestions(selectedLesson));
    setIndex(0);
    setScore(0);
    setSelected(null);
    setRoundSeed(createRoundSeed());
  };

  const choose = (choiceId: string) => {
    if (selected || !current) return;
    const choice = current.choices.find((item) => item.id === choiceId);
    setSelected(choiceId);
    trackLearningEvent("learning_game_answer", { game: "prompt-detective", question: index + 1, correct: Boolean(choice?.correct) });
    if (choice?.correct) {
      setScore((value) => value + 1);
      toast.success("Good catch. Read the note below to see why.");
    }
  };

  const next = () => {
    if (!selected) return;
    if (index === round.length - 1) {
      const finalScore = score;
      completeGame("prompt-detective", finalScore);
      trackLearningEvent("learning_game_complete", { game: "prompt-detective", score: finalScore, total: round.length });
      if (finalScore > best) {
        setBest(finalScore);
        saveBest(finalScore);
      }
      setIndex(round.length);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
  };

  const reset = () => {
    setLesson(null);
    setRound([]);
    setIndex(0);
    setScore(0);
    setSelected(null);
  };

  if (!lesson || !round.length) {
    return <LessonPicker onStart={start} best={best} />;
  }

  if (index >= round.length) {
    const finalScore = score;
    const message = finalScore >= 4 ? "Your prompt instincts are getting sharper." : "A good first round. The explanations are your cheat sheet.";
    return <div className="game-result"><div className="result-mark badge-burst"><Sparkles size={26} /></div><span className="game-kicker">CASE CLOSED</span><h2>{finalScore}<small> / {round.length}</small></h2><p className="result-message">{message}</p><div className="result-note"><strong>Your next move</strong><span>Pick one prompt from the shelf and adapt it to something you are learning today.</span></div><PostGameFeedback game="prompt-detective" /><CompletionNextSteps gameId="prompt-detective" /><ShareResult game="prompt-detective" score={finalScore} total={round.length} /><div className="game-result-actions"><button className="game-button game-button--primary" onClick={() => start(lesson)}><RotateCcw size={16} /> Play again</button><button className="game-button game-button--quiet" onClick={reset}>Choose another lesson</button><a className="game-button game-button--quiet" href={`/certificate?game=prompt-detective&score=${finalScore}&total=${round.length}`}>Share certificate <ArrowRight size={15} /></a></div></div>;
  }

  return <div className="game-play"><div className="game-progress-row"><span>CASE {String(index + 1).padStart(2, "0")} / {String(round.length).padStart(2, "0")}</span><span>{score} correct</span></div><div className="game-progress"><span style={{ width: `${progress}%` }} /></div><div className="game-scenario"><span className="game-kicker">THE BRIEF / {current.concept}</span><h2>{current.scenario}</h2></div><div className="answer-list">{orderedChoices.map((choice, choiceIndex) => { const isSelected = selected === choice.id; const showCorrect = Boolean(selected) && choice.correct; const showWrong = Boolean(selected) && isSelected && !choice.correct; return <button key={choice.id} className={`answer-card ${isSelected ? "is-selected" : ""} ${showCorrect ? "is-correct" : ""} ${showWrong ? "is-wrong" : ""}`} onClick={() => choose(choice.id)} disabled={Boolean(selected)}><span className="answer-letter">{String.fromCharCode(65 + choiceIndex)}</span><span>{choice.text}</span>{showCorrect && <Check className="answer-status" size={17} />}{showWrong && <X className="answer-status" size={17} />}</button>; })}</div>{selected && <div className={`game-feedback ${current.choices.find((choice) => choice.id === selected)?.correct ? "game-feedback--good" : "game-feedback--learn"}`}><div className="feedback-icon">{current.choices.find((choice) => choice.id === selected)?.correct ? <Check size={17} /> : <Sparkles size={17} />}</div><div><strong>{current.choices.find((choice) => choice.id === selected)?.correct ? "A useful signal." : `The stronger choice was ${correctChoice?.id.toUpperCase()}.`}</strong><p>{current.choices.find((choice) => choice.id === selected)?.explanation}</p></div></div>}<div className="game-footer-actions"><button className="game-back" onClick={reset}><ArrowLeft size={15} /> Exit lesson</button><button className="game-button game-button--primary" onClick={next} disabled={!selected}>{index === round.length - 1 ? "See your result" : "Next case"} <ArrowRight size={16} /></button></div></div>;
}

function LessonPicker({ onStart, best }: { onStart: (lesson: GameLesson) => void; best: number }) {
  return <div className="game-picker"><div className="game-picker-heading"><span className="game-kicker">PROMPT DETECTIVE / FIELD GAME 01</span><h2>Train your eye<br /><em>for better prompts.</em></h2><p>Thirty cases. Three choices. A clearer way to learn what makes an AI request useful.</p></div><div className="lesson-grid">{lessons.map((item, index) => <button className="lesson-card" key={item.id} onClick={() => onStart(item.id)}><span className="lesson-number">0{index + 1}</span><strong>{item.label}</strong><small>{item.description}</small><span className="lesson-start">Open case <ArrowRight size={14} /></span></button>)}</div>{best > 0 && <div className="best-score"><Sparkles size={15} /> Best desk score: <strong>{best}/30</strong></div>}</div>;
}
