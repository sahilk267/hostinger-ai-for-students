import type { ExplorerSkill } from "./explorerLab";
import { AGE_ADVENTURE_MISSIONS } from "./discoveryAgeMissions";

export type AdventureLocale = "en" | "hi" | "hinglish";
export type AdventureAgeBand = "8-10" | "11-13" | "14-17";
export type AdventureWorldId = "logic" | "mystery" | "creator";
export type AdventureMode = "sequence" | "single" | "multi";
export type Localized = Record<AdventureLocale, string>;

const t = (en: string, hi: string, hinglish: string): Localized => ({ en, hi, hinglish });

export const ADVENTURE_LOCALES: { id: AdventureLocale; label: string }[] = [
  { id: "hinglish", label: "Hinglish" },
  { id: "hi", label: "हिन्दी" },
  { id: "en", label: "English" },
];

export const ADVENTURE_AGE_BANDS: { id: AdventureAgeBand; label: Localized; tagline: Localized }[] = [
  { id: "8-10",
    label: t("Junior Adventurers · 8–10", "नन्हे खोजी · 8–10", "Junior Adventurers · 8–10"),
    tagline: t("Short, picture-friendly stories and small decisions.", "छोटी कहानियाँ और आसान, समझने योग्य निर्णय।", "Short stories aur easy, playful decisions."),
  },
  { id: "11-13",
    label: t("Skill Detectives · 11–13", "कौशल जासूस · 11–13", "Skill Detectives · 11–13"),
    tagline: t("Practice planning, checking evidence and improving your ideas.", "योजना, प्रमाण की जाँच और विचार सुधारने का अभ्यास।", "Planning, evidence checks aur ideas ko improve karne ki practice."),
  },
  { id: "14-17",
    label: t("Future Builders · 14–17", "भविष्य निर्माता · 14–17", "Future Builders · 14–17"),
    tagline: t("Explore realistic dilemmas, trade-offs and responsible AI workflows.", "वास्तविक समस्याएँ, विकल्प और जिम्मेदार AI प्रक्रियाएँ।", "Real-life dilemmas, trade-offs aur responsible AI workflows."),
  },
];

export const ADVENTURE_WORLDS: {
  id: AdventureWorldId;
  icon: string;
  title: Localized;
  description: Localized;
  accent: string;
}[] = [
  {
    id: "logic", icon: "🪐", accent: "mint",
    title: t("Logic Galaxy", "तर्क आकाशगंगा", "Logic Galaxy"),
    description: t("Plan a rescue, adapt to change and repair a bridge.", "बचाव की योजना बनाएँ, बदलाव के अनुसार सोचें और पुल सुधारें।", "Rescue plan karo, change handle karo aur bridge improve karo."),
  },
  {
    id: "mystery", icon: "🔎", accent: "amber",
    title: t("Mystery Island", "रहस्य द्वीप", "Mystery Island"),
    description: t("Inspect claims, spot misleading charts and follow clues.", "दावों की जाँच करें, भ्रामक चार्ट पहचानें और सुराग ढूँढें।", "Claims verify karo, tricky charts pakdo aur clues follow karo."),
  },
  {
    id: "creator", icon: "🛠️", accent: "violet",
    title: t("Creator Studio", "रचना स्टूडियो", "Creator Studio"),
    description: t("Design useful tools, teach clearly and improve a draft.", "उपयोगी टूल बनाएँ, स्पष्ट समझाएँ और डिज़ाइन सुधारें।", "Useful tool design karo, clear explain karo aur draft improve karo."),
  },
];


/** World descriptions are age-appropriate; not a generic label on identical content. */
const AGE_WORLD_DESCRIPTIONS: Record<"8-10" | "14-17", Record<AdventureWorldId, Localized>> = {
  "8-10": {
    logic: t("Guide friendly robots, spot patterns and try new routes.", "रोबोट को रास्ता दिखाएँ, पैटर्न समझें और नए रास्ते अपनाएँ।", "Friendly robots guide karo, patterns pakdo aur new routes try karo."),
    mystery: t("Solve a missing-book puzzle and check surprising school news.", "गुम किताब के सुराग ढूँढें और स्कूल की ख़बर जाँचें।", "Missing book clues solve karo aur school news check karo."),
    creator: t("Build helpful inventions and make games fair for friends.", "मददगार आविष्कार बनाएँ और दोस्तों के लिए खेल बेहतर करें।", "Helpful inventions banao aur friends ke liye fair games design karo."),
  },
  "14-17": {
    logic: t("Handle real constraints, trade-offs and project dependencies.", "असल बाधाएँ, विकल्प और परियोजना की निर्भरताएँ समझें।", "Real constraints, trade-offs aur project dependencies handle karo."),
    mystery: t("Investigate causal claims, survey bias and questionable AI citations.", "कारण संबंध, सर्वे पक्षपात और AI के संदिग्ध स्रोत जाँचें।", "Causal claims, survey bias aur AI citations investigate karo."),
    creator: t("Design accessible tools, verification workflows and evidence-led revisions.", "सुलभ टूल, जाँच प्रक्रियाएँ और प्रमाण-आधारित सुधार बनाएँ।", "Accessible tools, verification workflows aur evidence-led revisions design karo."),
  },
};

export function describeAdventureWorld(world: typeof ADVENTURE_WORLDS[number], ageBand: AdventureAgeBand, locale: AdventureLocale) {
  return ageBand === "11-13" ? world.description[locale] : AGE_WORLD_DESCRIPTIONS[ageBand][world.id][locale];
}

export type AdventureMission = {
  id: string;
  ageBand: AdventureAgeBand;
  world: AdventureWorldId;
  skill: ExplorerSkill;
  mode: AdventureMode;
  title: Localized;
  story: Localized;
  instruction: Localized;
  options: { id: string; label: Localized }[];
  answer: string[];
  feedback: Localized;
  /** A learning hint, not the answer key. Requesting it is recorded separately from independent success. */
  hint: Localized;
};

export const ADVENTURE_MISSIONS: AdventureMission[] = [
  {
    id: "rover-rescue", ageBand: "11-13", world: "logic", skill: "planning", mode: "sequence",
    title: t("Rescue the Rover", "रोवर को बचाएँ", "Rover ko rescue karo"),
    story: t("A research rover is stuck. Its battery lasts only one trip.", "एक शोध रोवर फँस गया है। उसकी बैटरी बस एक यात्रा के लिए है।", "Research rover phas gaya hai. Battery sirf ek trip ki hai."),
    instruction: t("Tap the cards in the safest order.", "कार्ड को सबसे सुरक्षित क्रम में चुनें।", "Cards ko safest order mein tap karo."),
    options: [
      { id: "a", label: t("Read the terrain map", "रास्ते का नक्शा देखें", "Terrain map check karo") },
      { id: "b", label: t("Choose a safe route", "सुरक्षित रास्ता चुनें", "Safe route choose karo") },
      { id: "c", label: t("Drive the rover", "रोवर चलाएँ", "Rover drive karo") },
      { id: "d", label: t("Check the rover arrived", "पहुँचने की पुष्टि करें", "Confirm karo rover pahunch gaya") },
    ],
    answer: ["a", "b", "c", "d"],
    feedback: t("Good planning starts with information, then a safe choice, an action and a check.", "अच्छी योजना में पहले जानकारी, फिर सुरक्षित निर्णय, कार्य और जाँच आती है।", "Achha plan: pehle information, phir safe choice, action aur final check."),
    hint: t("Which information should you gather before deciding where to drive?", "गाड़ी कहाँ चलानी है, यह तय करने से पहले कौन सी जानकारी चाहिए?", "Drive karne ka decision lene se pehle kaunsi information chahiye?"),
  },
  {
    id: "rule-switch", ageBand: "11-13", world: "logic", skill: "flexibility", mode: "single",
    title: t("The Rule Changed!", "नियम बदल गया!", "Rule change ho gaya!"),
    story: t("Your rover's bridge is closed. The map also shows a longer, safe path.", "रोवर का पुल बंद है। नक्शे पर एक लंबा मगर सुरक्षित रास्ता भी है।", "Rover ka bridge band hai. Map par ek lamba but safe route bhi hai."),
    instruction: t("What is your best next move?", "अब सबसे अच्छा कदम क्या होगा?", "Ab best next move kya hoga?"),
    options: [
      { id: "a", label: t("Keep trying the closed bridge", "बंद पुल को बार-बार आज़माएँ", "Closed bridge try karte raho") },
      { id: "b", label: t("Check and use the safe alternate route", "वैकल्पिक सुरक्षित रास्ता जाँचकर अपनाएँ", "Safe alternate route check karke use karo") },
      { id: "c", label: t("Drive without checking anything", "कुछ जाँचे बिना आगे बढ़ें", "Bina check kiye drive karo") },
    ],
    answer: ["b"],
    feedback: t("Flexibility means updating a plan when evidence or constraints change.", "लचीलापन मतलब नई जानकारी या बाधा मिलने पर योजना बदलना।", "Flexibility ka matlab nayi information milne par plan update karna."),
    hint: t("When one route closes, look for a route you can safely check.", "जब एक रास्ता बंद हो, तो जाँचने योग्य सुरक्षित विकल्प तलाशें।", "Ek route band ho toh alternate safe route check karo."),
  },
  {
    id: "bridge-lab", ageBand: "11-13", world: "logic", skill: "reflection", mode: "multi",
    title: t("Fix the Wobbly Bridge", "डगमगाता पुल सुधारें", "Wobbly bridge fix karo"),
    story: t("Your first paper bridge collapsed under a toy truck.", "आपका पहला कागज़ का पुल खिलौना ट्रक के भार से गिर गया।", "Pehla paper bridge toy truck ke weight se gir gaya."),
    instruction: t("Choose TWO useful changes to test.", "जाँचने के लिए दो उपयोगी बदलाव चुनें।", "Test karne ke liye DO useful changes choose karo."),
    options: [
      { id: "a", label: t("Make the base wider", "आधार चौड़ा करें", "Base wider karo") },
      { id: "b", label: t("Add a supporting fold", "सहारा देने वाला मोड़ जोड़ें", "Supporting fold add karo") },
      { id: "c", label: t("Ignore the collapse", "गिरने को अनदेखा करें", "Collapse ignore karo") },
      { id: "d", label: t("Use the same design without testing", "बिना जाँच वही डिज़ाइन दोहराएँ", "Bina testing same design repeat karo") },
    ],
    answer: ["a", "b"],
    feedback: t("A failed attempt is useful evidence. Change a feature, then test again.", "असफल प्रयास भी जानकारी देता है। बदलाव करें, फिर दोबारा जाँचें।", "Failed attempt bhi evidence hai. Ek feature change karke test again."),
    hint: t("Think about support and stability, rather than hiding the failed attempt.", "असफलता छिपाने की बजाय सहारे और स्थिरता के बारे में सोचें।", "Failure ignore mat karo. Support aur stability ke baare mein socho."),
  },
  {
    id: "viral-claim", ageBand: "11-13", world: "mystery", skill: "evidence", mode: "multi",
    title: t("The Viral Claim", "वायरल दावे की जाँच", "Viral claim check karo"),
    story: t("A post says 'one study trick works for EVERY student!' but gives no link.", "एक पोस्ट कहती है 'एक पढ़ाई का तरीका हर छात्र के लिए काम करता है!' लेकिन लिंक नहीं है।", "Ek post bolti hai 'one trick sab students ke liye works!' par source link nahi."),
    instruction: t("Choose TWO checks before believing it.", "विश्वास करने से पहले दो जाँचें चुनें।", "Believe karne se pehle DO checks choose karo."),
    options: [
      { id: "a", label: t("Look for the original study", "मूल शोध ढूँढें", "Original study dhoondo") },
      { id: "b", label: t("Check who was included in the study", "देखें शोध में किन लोगों को शामिल किया गया", "Check karo study mein kaun log the") },
      { id: "c", label: t("Count the likes", "लाइक्स गिनें", "Likes count karo") },
      { id: "d", label: t("Trust the dramatic headline", "सनसनीखेज शीर्षक पर भरोसा करें", "Dramatic headline trust karo") },
    ],
    answer: ["a", "b"],
    feedback: t("A claim needs sources and context. Even a real study may not apply to everyone.", "दावे के लिए स्रोत और संदर्भ ज़रूरी हैं। सही शोध भी सभी पर लागू नहीं होता।", "Claim ke liye source aur context chahiye. Real study bhi sab par apply nahi hoti."),
    hint: t("Popularity is not the same as reliable evidence. Who tested the idea, and with whom?", "लोकप्रियता प्रमाण नहीं है। विचार की जाँच किसने और किन लोगों पर की?", "Likes evidence nahi hain. Kisne test kiya aur kin logon ke saath?"),
  },
  {
    id: "chart-trap", ageBand: "11-13", world: "mystery", skill: "evidence", mode: "single",
    title: t("The Tricky Chart", "भ्रामक चार्ट", "Tricky chart"),
    story: t("Two bars look hugely different, but the vertical axis starts at 95, not zero.", "दो बार बहुत अलग दिखते हैं, लेकिन ऊर्ध्वाधर अक्ष 0 नहीं, 95 से शुरू होता है।", "Do bars bahut different lagte hain, but vertical axis zero ki jagah 95 se start hai."),
    instruction: t("What should you do before concluding?", "निष्कर्ष निकालने से पहले क्या करेंगे?", "Conclusion se pehle kya karoge?"),
    options: [
      { id: "a", label: t("Compare the axis scale and underlying numbers", "अक्ष का पैमाना और मूल संख्याएँ जाँचें", "Axis scale aur actual numbers check karo") },
      { id: "b", label: t("Believe the tallest-looking bar", "सबसे ऊँचे दिखने वाले बार पर भरोसा करें", "Tallest-looking bar trust karo") },
      { id: "c", label: t("Share the chart immediately", "चार्ट तुरंत शेयर करें", "Chart immediately share karo") },
    ],
    answer: ["a"],
    feedback: t("Graphs can exaggerate differences. Check scales, labels and source data.", "ग्राफ अंतर बढ़ा-चढ़ाकर दिखा सकते हैं। पैमाना, लेबल और डेटा जाँचें।", "Graphs differences exaggerate kar sakte hain. Scale, labels aur data check karo."),
    hint: t("Look carefully at the axis before comparing how tall the bars appear.", "बार की ऊँचाई की तुलना से पहले अक्ष का पैमाना देखें।", "Bars compare karne se pehle axis ka scale dekho."),
  },
  {
    id: "screenshot-check", ageBand: "11-13", world: "mystery", skill: "explanation", mode: "sequence",
    title: t("Investigate a Screenshot", "स्क्रीनशॉट की पड़ताल", "Screenshot investigate karo"),
    story: t("A screenshot claims a school rule changed today, but no official notice is visible.", "एक स्क्रीनशॉट में आज स्कूल का नियम बदलने का दावा है, पर आधिकारिक सूचना नहीं है।", "Screenshot bolta hai school rule aaj change hua, but official notice nahi hai."),
    instruction: t("Build a responsible verification sequence.", "जिम्मेदार जाँच का क्रम बनाएँ।", "Responsible verification ka sequence banao."),
    options: [
      { id: "a", label: t("Find the official school notice", "स्कूल की आधिकारिक सूचना ढूँढें", "Official school notice dhoondo") },
      { id: "b", label: t("Check the notice date and details", "सूचना की तारीख और विवरण जाँचें", "Notice ki date aur details check karo") },
      { id: "c", label: t("Only then explain what is confirmed", "फिर केवल पुष्ट बात ही बताएँ", "Tabhi jo confirm hai woh explain karo") },
    ],
    answer: ["a", "b", "c"],
    feedback: t("Find the original source, confirm its context, then communicate only what is supported.", "मूल स्रोत खोजें, संदर्भ जाँचें और फिर केवल पुष्ट तथ्य बताएँ।", "Pehle original source, phir context, aur sirf confirmed facts explain karo."),
    hint: t("What original document can confirm this screenshot, and does its date match?", "कौन सा मूल दस्तावेज़ स्क्रीनशॉट की पुष्टि करेगा और क्या तारीख मेल खाती है?", "Kaunsa original document screenshot verify karega? Date bhi check karo."),
  },
  {
    id: "study-buddy", ageBand: "11-13", world: "creator", skill: "creativity", mode: "multi",
    title: t("Design a Study Buddy", "स्टडी बडी डिज़ाइन करें", "Study Buddy design karo"),
    story: t("Build a learning helper that supports thinking instead of giving away homework answers.", "ऐसा सहायक बनाएँ जो गृहकार्य के उत्तर देने की जगह सोचने में मदद करे।", "Aisa helper banao jo homework answer dene ke bajaye thinking support kare."),
    instruction: t("Choose TWO responsible features.", "दो जिम्मेदार फीचर चुनें।", "DO responsible features choose karo."),
    options: [
      { id: "a", label: t("Give hints, one at a time", "एक बार में एक संकेत दे", "Ek time par ek hint de") },
      { id: "b", label: t("Ask the learner to explain the answer", "सीखने वाले से कारण पूछे", "Learner se answer explain karwaye") },
      { id: "c", label: t("Write all graded homework automatically", "सारा मूल्यांकित गृहकार्य खुद लिख दे", "Saara graded homework automatically likhe") },
      { id: "d", label: t("Publish classmates' private notes", "सहपाठियों के निजी नोट्स प्रकाशित करे", "Classmates ke private notes publish kare") },
    ],
    answer: ["a", "b"],
    feedback: t("Helpful learning tools support effort, feedback and privacy—not shortcuts.", "अच्छे लर्निंग टूल प्रयास, फीडबैक और गोपनीयता को बढ़ावा देते हैं।", "Helpful tool effort, feedback aur privacy support karta hai, shortcuts nahi."),
    hint: t("Which features still leave the real thinking to the learner?", "कौन सी सुविधाएँ वास्तविक सोच विद्यार्थी के पास ही रहने देती हैं?", "Kaunse features learner ko khud sochne dete hain?"),
  },
  {
    id: "teach-the-robot", ageBand: "11-13", world: "creator", skill: "creativity", mode: "sequence",
    title: t("Teach the Tiny Robot", "नन्हे रोबोट को सिखाएँ", "Tiny robot ko sikhayo"),
    story: t("A robot must learn how to sort paper and plastic, and it needs clear instructions.", "एक रोबोट को कागज़ और प्लास्टिक अलग करना सीखना है। उसे स्पष्ट निर्देश चाहिए।", "Robot ko paper aur plastic separate karna seekhna hai. Clear instructions chahiye."),
    instruction: t("Put the teaching cards in a useful order.", "सिखाने वाले कार्ड सही क्रम में रखें।", "Teaching cards useful order mein arrange karo."),
    options: [
      { id: "a", label: t("Show an example of paper and plastic", "कागज़ और प्लास्टिक का उदाहरण दिखाएँ", "Paper aur plastic ka example dikhao") },
      { id: "b", label: t("Explain the sorting rule", "अलग करने का नियम समझाएँ", "Sorting rule explain karo") },
      { id: "c", label: t("Try a new item and check the result", "नई चीज़ पर आज़माएँ और परिणाम जाँचें", "New item try karke result check karo") },
    ],
    answer: ["a", "b", "c"],
    feedback: t("An example, a rule and a test help someone understand a process.", "उदाहरण, नियम और जाँच किसी प्रक्रिया को समझने में मदद करते हैं।", "Example, rule aur test se process samajhna easier hota hai."),
    hint: t("A learner needs an example, a rule and a way to check the rule.", "सीखने वाले को उदाहरण, नियम और उस नियम की जाँच चाहिए।", "Learner ko example, rule aur test chahiye."),
  },
  {
    id: "poster-upgrade", ageBand: "11-13", world: "creator", skill: "flexibility", mode: "single",
    title: t("Upgrade the Poster", "पोस्टर बेहतर बनाएँ", "Poster upgrade karo"),
    story: t("A friend says your science poster looks nice, but the main instruction is hard to find.", "दोस्त कहता है विज्ञान पोस्टर सुंदर है, लेकिन मुख्य निर्देश दिख नहीं रहा।", "Friend bolta hai science poster nice hai, par main instruction clear nahi."),
    instruction: t("Which revision best uses that feedback?", "कौन सा सुधार उस फीडबैक का सही उपयोग है?", "Kaunsa revision feedback ko best use karta hai?"),
    options: [
      { id: "a", label: t("Add more decorations", "और सजावट जोड़ें", "More decorations add karo") },
      { id: "b", label: t("Make the main instruction prominent and test again", "मुख्य निर्देश उभारें और फिर जाँचें", "Main instruction prominent karo, then test again") },
      { id: "c", label: t("Ignore the reader", "पाठक की बात अनदेखी करें", "Reader ko ignore karo") },
    ],
    answer: ["b"],
    feedback: t("Specific feedback helps you change the right feature and retest it.", "स्पष्ट फीडबैक से सही सुधार और दोबारा जाँच संभव होती है।", "Specific feedback se right feature improve karke dobara test kar sakte ho."),
    hint: t("The reader found the instruction hard to find. Focus on making that instruction clearer.", "पाठक को निर्देश ढूँढने में कठिनाई हुई। निर्देश को स्पष्ट करें।", "Reader ko instruction nahi mil raha. Instruction clear karne par focus karo."),
  },
];

export const ALL_ADVENTURE_MISSIONS: AdventureMission[] = [...ADVENTURE_MISSIONS, ...AGE_ADVENTURE_MISSIONS];

export function getAgeAdventureMissions(ageBand: AdventureAgeBand): AdventureMission[] {
  return ALL_ADVENTURE_MISSIONS.filter((mission) => mission.ageBand === ageBand);
}

/** Stable permutation for one play session. Does not award security-sensitive scores. */
export function shuffledAdventureOptions(mission: AdventureMission, seed: number): AdventureMission["options"] {
  const options = [...mission.options];
  let state = (seed >>> 0) || 1;
  for (let i = options.length - 1; i > 0; i--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [options[i], options[j]] = [options[j], options[i]];
  }
  // Avoid accidentally displaying a correct sequence top-to-bottom.
  if (mission.mode === "sequence" && options.every((option, i) => option.id === mission.answer[i])) {
    [options[0], options[1]] = [options[1], options[0]];
  }
  return options;
}

export function evaluateAdventureAnswer(mission: AdventureMission, selected: string[]): boolean {
  if (selected.length !== mission.answer.length || new Set(selected).size !== selected.length) return false;
  if (selected.some((id) => !mission.options.some((option) => option.id === id))) return false;
  if (mission.mode === "sequence") return mission.answer.every((id, index) => selected[index] === id);
  return mission.answer.every((id) => selected.includes(id));
}

export type AdventureAttempt = {
  firstCorrect: boolean;
  /** First check was correct without opening a hint. */
  firstIndependent: boolean;
  bestCorrect: boolean;
  attempts: number;
  /** Number of submitted attempts where a hint was opened. */
  hintsUsed: number;
  enjoyed: boolean | null;
  updatedAt: string;
};

export function summarizeAdventure(attempts: Record<string, AdventureAttempt>, ageBand: AdventureAgeBand = "11-13") {
  return ADVENTURE_WORLDS.map((world) => {
    const missions = getAgeAdventureMissions(ageBand).filter((mission) => mission.world === world.id);
    const recorded = missions.map((mission) => attempts[mission.id]).filter((item): item is AdventureAttempt => Boolean(item));
    return {
      world,
      practiced: recorded.length,
      firstTryCorrect: recorded.filter((item) => item.firstCorrect).length,
      firstIndependent: recorded.filter((item) => item.firstIndependent).length,
      solvedWithPractice: recorded.filter((item) => item.bestCorrect).length,
      revisedToCorrect: recorded.filter((item) => !item.firstCorrect && item.bestCorrect).length,
      hintedAttempts: recorded.reduce((total, item) => total + item.hintsUsed, 0),
      enjoyed: recorded.filter((item) => item.enjoyed === true).length,
    };
  });
}


/** Suggestions are transparent practice navigation, not a validated aptitude or career inference. */
export function chooseAdventureNextPractice(attempts: Record<string, AdventureAttempt>, ageBand: AdventureAgeBand = "11-13") {
  const available = getAgeAdventureMissions(ageBand);
  const retry = available.find((mission) => attempts[mission.id] && !attempts[mission.id].bestCorrect);
  const next = retry ?? available.find((mission) => !attempts[mission.id]) ?? null;
  const explicitlyEnjoyed = summarizeAdventure(attempts, ageBand)
    .filter((item) => item.enjoyed > 0)
    .sort((a, b) => b.enjoyed - a.enjoyed)[0] ?? null;
  return { mission: next, isRetry: Boolean(retry), enjoyedWorld: explicitlyEnjoyed?.world ?? null };
}
