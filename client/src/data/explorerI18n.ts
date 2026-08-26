export type ExplorerLocale = "hinglish" | "hi" | "en";

export const EXPLORER_LOCALES: Array<{ id: ExplorerLocale; label: string; note: string }> = [
  { id: "hinglish", label: "Hinglish", note: "India-first, easy mix" },
  { id: "hi", label: "हिन्दी", note: "हिन्दी में" },
  { id: "en", label: "English", note: "For worldwide learners" },
];

export const explorerFieldLabels: Record<ExplorerLocale, Record<string, string>> = {
  hinglish: { choice: "Kya choose kiya?", reason: "Kyun choose kiya?", artifact: "Kya banaya ya arrange kiya?", reflection: "Kya naya samajh aaya?", revision: "Kya change kiya?" },
  hi: { choice: "क्या चुना?", reason: "क्यों चुना?", artifact: "क्या बनाया या सजाया?", reflection: "क्या नया समझ आया?", revision: "क्या बदला?" },
  en: { choice: "What did you choose?", reason: "Why did you choose it?", artifact: "What did you make or arrange?", reflection: "What became clearer?", revision: "What did you change?" },
};

export const explorerFieldPlaceholders: Record<ExplorerLocale, Record<string, string>> = {
  hinglish: { choice: "Apna move choose karo…", reason: "Ek reason chip choose karo ya apne words mein batao…", artifact: "Jo banaya, draw ya arrange kiya uska short description…", reflection: "Maine notice kiya…", revision: "Meri second try mein…" },
  hi: { choice: "अपना कदम चुनें…", reason: "एक कारण चुनें या अपने शब्दों में बताएं…", artifact: "जो बनाया, चित्र बनाया या सजाया उसका छोटा विवरण…", reflection: "मैंने देखा…", revision: "मेरी दूसरी कोशिश में…" },
  en: { choice: "Choose or describe your move…", reason: "Choose a reason chip or explain in your own words…", artifact: "Briefly describe what you made, drew or arranged…", reflection: "I noticed…", revision: "My second try…" },
};

export const explorerCopy: Record<ExplorerLocale, {
  chooseLanguage: string;
  setupTitle: string;
  setupHint: string;
  missionPickerTitle: string;
  playFirst: string;
  playFirstHint: string;
  listen: string;
  listening: string;
  chooseMove: string;
  choiceSaved: string;
  answerLater: string;
  optionalWriting: string;
  evidencePrompt: string;
  complete: string;
  reportNotice: string;
  reasonOptions: string[];
  firstMove: string;
  nextMove: string;
  chooseCard: string;
}> = {
  hinglish: {
    chooseLanguage: "Language choose karo",
    setupTitle: "Aaj kaun explore karega?",
    setupHint: "Age band choose karo. Isse game ka size aur reading load learner ke liye fit rahega.",
    missionPickerTitle: "Apna mission choose karo",

    playFirst: "Pehle khelo, baad mein batao",
    playFirstHint: "Yahan reading ya typing zaroori nahi. Picture-style options mein se apna move choose karo.",
    listen: "Suno",
    listening: "Sunaya ja raha hai…",
    chooseMove: "Apna move choose karo",
    choiceSaved: "Move save ho gaya",
    answerLater: "Answer baad mein likh sakte ho",
    optionalWriting: "Typing optional hai",
    evidencePrompt: "Ab apne move ka chhota proof do",
    complete: "Proof save karo & mission complete",
    reportNotice: "Ye practice signal hai, IQ ya future prediction nahi.",
    reasonOptions: ["Mujhe ye safe laga", "Mujhe ye smart laga", "Maine clue dekha", "Maine naya way try kiya"],
    firstMove: "Pehla move",
    nextMove: "Agla move",
    chooseCard: "Card choose karo…",
  },
  hi: {
    chooseLanguage: "भाषा चुनें",
    setupTitle: "आज कौन explore करेगा?",
    setupHint: "उम्र का समूह चुनें। इससे खेल और पढ़ने की मात्रा बच्चे के लिए सही रहेगी।",
    missionPickerTitle: "अपना मिशन चुनें",

    playFirst: "पहले खेलें, बाद में बताएं",
    playFirstHint: "यहाँ पढ़ना या टाइप करना ज़रूरी नहीं है। चित्र-जैसे विकल्पों में से अपना कदम चुनें।",
    listen: "सुनें",
    listening: "सुनाया जा रहा है…",
    chooseMove: "अपना कदम चुनें",
    choiceSaved: "कदम सेव हो गया",
    answerLater: "उत्तर बाद में लिख सकते हैं",
    optionalWriting: "टाइप करना वैकल्पिक है",
    evidencePrompt: "अब अपने कदम का छोटा प्रमाण दें",
    complete: "प्रमाण सेव करें और मिशन पूरा करें",
    reportNotice: "यह अभ्यास का संकेत है, IQ या भविष्यवाणी नहीं।",
    reasonOptions: ["यह सुरक्षित लगा", "यह समझदारी लगा", "मैंने संकेत देखा", "मैंने नया तरीका आज़माया"],
    firstMove: "पहला कदम",
    nextMove: "अगला कदम",
    chooseCard: "कार्ड चुनें…",
  },
  en: {
    chooseLanguage: "Choose language",
    setupTitle: "Who is exploring today?",
    setupHint: "Choose an age band so the game size and reading load fit the learner.",
    missionPickerTitle: "Choose a mission",

    playFirst: "Play first, explain later",
    playFirstHint: "Reading and typing are not required here. Choose a picture-style move first.",
    listen: "Listen",
    listening: "Reading aloud…",
    chooseMove: "Choose your move",
    choiceSaved: "Move saved",
    answerLater: "You can write your answer later",
    optionalWriting: "Typing is optional",
    evidencePrompt: "Now add a small piece of proof",
    complete: "Save proof & complete mission",
    reportNotice: "This is a practice signal, not an IQ score or prediction.",
    reasonOptions: ["It felt safe", "It seemed useful", "I noticed a clue", "I tried a new way"],
    firstMove: "First move",
    nextMove: "Next move",
    chooseCard: "Choose a card…",
  },
};

export const quickPlayOptions: Record<string, Array<{ icon: string; label: Record<ExplorerLocale, string>; evidence: Record<ExplorerLocale, string> }>> = {
  "choice-observatory": [
    { icon: "🧭", label: { hinglish: "Pehle plan", hi: "पहले योजना", en: "Plan first" }, evidence: { hinglish: "Maine pehle plan banaya.", hi: "मैंने पहले योजना बनाई।", en: "I made a plan first." } },
    { icon: "👀", label: { hinglish: "Clue dekho", hi: "संकेत देखो", en: "Look for a clue" }, evidence: { hinglish: "Maine pehle clue dekha.", hi: "मैंने पहले संकेत देखा।", en: "I looked for a clue first." } },
    { icon: "🧪", label: { hinglish: "Try karke dekho", hi: "कोशिश करके देखो", en: "Try and observe" }, evidence: { hinglish: "Maine try karke observe kiya.", hi: "मैंने कोशिश करके देखा।", en: "I tried and observed." } },
  ],
  "source-hunt": [
    { icon: "🔎", label: { hinglish: "Source check", hi: "स्रोत जाँचें", en: "Check the source" }, evidence: { hinglish: "Maine source check kiya.", hi: "मैंने स्रोत जाँचा।", en: "I checked the source." } },
    { icon: "❓", label: { hinglish: "Ek sawal", hi: "एक सवाल", en: "Ask one question" }, evidence: { hinglish: "Maine pehle ek sawal poocha.", hi: "मैंने पहले एक सवाल पूछा।", en: "I asked one question first." } },
    { icon: "⚖️", label: { hinglish: "Compare karo", hi: "तुलना करें", en: "Compare two clues" }, evidence: { hinglish: "Maine do clues compare kiye.", hi: "मैंने दो संकेतों की तुलना की।", en: "I compared two clues." } },
  ],
  "build-studio": [
    { icon: "💡", label: { hinglish: "Idea 1", hi: "विचार 1", en: "Idea 1" }, evidence: { hinglish: "Maine ek idea banaya.", hi: "मैंने एक विचार बनाया।", en: "I made one idea." } },
    { icon: "🧩", label: { hinglish: "Mix ideas", hi: "विचार मिलाएँ", en: "Mix ideas" }, evidence: { hinglish: "Maine ideas ko mix kiya.", hi: "मैंने विचारों को मिलाया।", en: "I combined ideas." } },
    { icon: "🛠️", label: { hinglish: "Useful banao", hi: "उपयोगी बनाएं", en: "Make it useful" }, evidence: { hinglish: "Maine idea ko useful banaya.", hi: "मैंने विचार को उपयोगी बनाया।", en: "I made the idea useful." } },
  ],
  "explain-it": [
    { icon: "🖼️", label: { hinglish: "Picture dikhao", hi: "चित्र दिखाएँ", en: "Show a picture" }, evidence: { hinglish: "Maine picture se samjhaya.", hi: "मैंने चित्र से समझाया।", en: "I explained with a picture." } },
    { icon: "🗣️", label: { hinglish: "Example do", hi: "उदाहरण दें", en: "Give an example" }, evidence: { hinglish: "Maine example diya.", hi: "मैंने उदाहरण दिया।", en: "I gave an example." } },
    { icon: "🤝", label: { hinglish: "Samne wale se poochho", hi: "सामने वाले से पूछें", en: "Check understanding" }, evidence: { hinglish: "Maine poocha ki samajh aaya ya nahi.", hi: "मैंने पूछा कि समझ आया या नहीं।", en: "I checked understanding." } },
  ],
  "strategy-switch": [
    { icon: "🔁", label: { hinglish: "Naya way", hi: "नया तरीका", en: "Try a new way" }, evidence: { hinglish: "Maine naya way try kiya.", hi: "मैंने नया तरीका आज़माया।", en: "I tried a new way." } },
    { icon: "🧠", label: { hinglish: "Rule samjho", hi: "नियम समझें", en: "Notice the rule" }, evidence: { hinglish: "Maine pehle rule notice kiya.", hi: "मैंने पहले नियम को देखा।", en: "I noticed the rule first." } },
    { icon: "🧭", label: { hinglish: "Doosra route", hi: "दूसरा रास्ता", en: "Choose another route" }, evidence: { hinglish: "Maine doosra route choose kiya.", hi: "मैंने दूसरा रास्ता चुना।", en: "I chose another route." } },
  ],
  "reflect-improve": [
    { icon: "🔧", label: { hinglish: "Ek cheez badlo", hi: "एक चीज़ बदलें", en: "Change one thing" }, evidence: { hinglish: "Maine ek cheez badli.", hi: "मैंने एक चीज़ बदली।", en: "I changed one thing." } },
    { icon: "✨", label: { hinglish: "Better banao", hi: "बेहतर बनाएं", en: "Make it clearer" }, evidence: { hinglish: "Maine output ko clearer banaya.", hi: "मैंने परिणाम को बेहतर बनाया।", en: "I made the output clearer." } },
    { icon: "🔄", label: { hinglish: "Try again", hi: "फिर कोशिश करें", en: "Try again" }, evidence: { hinglish: "Maine dobara try kiya.", hi: "मैंने फिर कोशिश की।", en: "I tried again." } },
  ],
};

export function getExplorerLocale(): ExplorerLocale {
  if (typeof navigator === "undefined") return "hinglish";
  const language = navigator.language.toLowerCase();
  if (language.startsWith("hi")) return "hi";
  if (language.startsWith("en-in")) return "hinglish";
  return "en";
}

export function speakExplorerText(text: string, locale: ExplorerLocale): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = locale === "hi" ? "hi-IN" : locale === "hinglish" ? "en-IN" : "en-US";
  window.speechSynthesis.speak(utterance);
}

export type ExplorerVisualMode = "sequence" | "clue-pick" | "idea-build" | "audience-match" | "rule-switch" | "change-spot";

export const visualModeCopy: Record<ExplorerVisualMode, Record<ExplorerLocale, { label: string; instruction: string; done: string }>> = {
  sequence: {
    hinglish: { label: "Step order game", instruction: "Pehle kaunsa step? Do cards ko sahi order mein choose karo.", done: "Plan ke do steps choose ho gaye." },
    hi: { label: "क्रम खेल", instruction: "पहले कौन सा कदम? दो कार्ड सही क्रम में चुनें।", done: "योजना के दो कदम चुन लिए गए।" },
    en: { label: "Step order game", instruction: "Which step comes first? Choose two cards in order.", done: "Two planning steps selected." },
  },
  "clue-pick": {
    hinglish: { label: "Clue hunt", instruction: "Do clues choose karo jo claim ko check karne mein help karein.", done: "Do useful clues choose ho gaye." },
    hi: { label: "संकेत खोज", instruction: "दो संकेत चुनें जो दावे की जाँच में मदद करें।", done: "दो उपयोगी संकेत चुन लिए गए।" },
    en: { label: "Clue hunt", instruction: "Choose two clues that help you check the claim.", done: "Two useful clues selected." },
  },
  "idea-build": {
    hinglish: { label: "Idea builder", instruction: "Do pieces choose karke ek useful idea banao.", done: "Idea ke do pieces combine ho gaye." },
    hi: { label: "विचार बनाएं", instruction: "दो हिस्से चुनकर एक उपयोगी विचार बनाएं।", done: "विचार के दो हिस्से मिल गए।" },
    en: { label: "Idea builder", instruction: "Choose two pieces to build one useful idea.", done: "Two idea pieces combined." },
  },
  "audience-match": {
    hinglish: { label: "Audience match", instruction: "Jiske liye explain karna hai, us audience ko choose karo.", done: "Audience choose ho gayi." },
    hi: { label: "दर्शक चुनें", instruction: "जिसके लिए समझाना है, उस दर्शक को चुनें।", done: "दर्शक चुन लिया गया।" },
    en: { label: "Audience match", instruction: "Choose the audience you are explaining to.", done: "Audience selected." },
  },
  "rule-switch": {
    hinglish: { label: "Rule switch", instruction: "Naya rule aane par doosra move choose karo.", done: "New rule ke baad move choose ho gaya." },
    hi: { label: "नियम बदलें", instruction: "नया नियम आने पर दूसरा कदम चुनें।", done: "नए नियम के बाद कदम चुन लिया।" },
    en: { label: "Rule switch", instruction: "When the rule changes, choose a different move.", done: "A move was chosen after the new rule." },
  },
  "change-spot": {
    hinglish: { label: "Change spot", instruction: "Do tiles mein se jo change hua hai usko choose karo.", done: "Change spot mil gaya." },
    hi: { label: "बदलाव खोजें", instruction: "दो टाइल में जो बदला है उसे चुनें।", done: "बदलाव मिल गया।" },
    en: { label: "Change spot", instruction: "Choose the tile that changed.", done: "The change was spotted." },
  },
};

export const visualModeForKind: Record<string, ExplorerVisualMode> = {
  "choice-observatory": "sequence",
  "source-hunt": "clue-pick",
  "build-studio": "idea-build",
  "explain-it": "audience-match",
  "strategy-switch": "rule-switch",
  "reflect-improve": "change-spot",
};

export const visualModeCards: Record<ExplorerVisualMode, string[]> = {
  sequence: ["👀 Notice", "🧭 Plan", "✅ Check"],
  "clue-pick": ["🔎 Source", "📅 Date", "💬 Opinion"],
  "idea-build": ["💡 Idea", "🛠️ Useful", "🎨 Style"],
  "audience-match": ["🧒 Friend", "👩‍🏫 Teacher", "🌍 Public"],
  "rule-switch": ["🔁 New rule", "🧠 Same move", "🧭 New move"],
  "change-spot": ["🟦 Before", "🟨 Changed", "🟩 Same"],
};
