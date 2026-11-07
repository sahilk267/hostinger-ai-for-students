import type { AdventureAgeBand, AdventureLocale, AdventureWorldId, Localized } from "./discoveryAdventure";

/**
 * NEW situations (not copies of the nine practice missions). Each requires
 * both a practical decision AND a supporting reason. Questions and grading
 * are intentionally browser-local and do NOT establish verified identity,
 * psychometrics, aptitude or eligibility for an accredited certificate.
 */
const t = (en: string, hi: string, hinglish: string): Localized => ({ en, hi, hinglish });
const opt = (id: string, en: string, hi: string, hinglish: string) => ({ id, label: t(en, hi, hinglish) });
export type TransferOption = ReturnType<typeof opt>;
export type TransferChallenge = {
  id: string;
  band: AdventureAgeBand;
  world: AdventureWorldId;
  icon: string;
  title: Localized;
  situation: Localized;
  question: Localized;
  whyQuestion: Localized;
  decisions: TransferOption[];
  reasons: TransferOption[];
  correctDecision: string;
  correctReason: string;
  explanation: Localized;
  parentActivity: Localized;
};
const challenges: TransferChallenge[] = [
  {
    id: "transfer-junior-route", band: "8-10", world: "logic", icon: "🚂",
    title: t("The Toy Train Detour", "खिलौना रेल का नया रास्ता", "Toy train ka detour"),
    situation: t("A toy train must reach the blue station. The short track is broken, but the long track is safe.", "खिलौना रेल को नीले स्टेशन जाना है। छोटा रास्ता टूटा है, लंबा रास्ता सुरक्षित है।", "Toy train blue station jayegi. Short track broken hai, long track safe hai."),
    question: t("What should the train driver do?", "ड्राइवर को क्या करना चाहिए?", "Driver ko kya karna chahiye?"),
    whyQuestion: t("Why does your choice make sense?", "आपका विकल्प ठीक क्यों है?", "Aapka choice sahi kyon hai?"),
    decisions: [opt("a", "Check and take the safe longer track", "सुरक्षित लंबे रास्ते को जाँचकर लें", "Safe long track check karke lo"), opt("b", "Drive faster over the broken track", "टूटे रास्ते पर तेज़ चलें", "Broken track pe fast chalo"), opt("c", "Stop looking at the map", "नक्शा देखना बंद कर दें", "Map dekhna band karo")],
    reasons: [opt("a", "A checked alternative avoids a known danger", "जाँचा हुआ दूसरा रास्ता ज्ञात खतरे से बचाता है", "Checked alternative known danger avoid karta hai"), opt("b", "The shortest track is always the best", "सबसे छोटा रास्ता हमेशा अच्छा होता है", "Shortest track always best hota hai"), opt("c", "A driver does not need a plan", "ड्राइवर को योजना नहीं चाहिए", "Driver ko plan nahi chahiye")],
    correctDecision: "a", correctReason: "a",
    explanation: t("Good planning changes when new obstacles appear. Safety matters more than the shortest route.", "नई बाधा मिलने पर योजना बदलें। सबसे छोटे रास्ते से ज़्यादा सुरक्षा ज़रूरी है।", "Obstacle aaye toh plan update karo. Safety shortest route se important hai."),
    parentActivity: t("Draw two routes to a room. Block one and ask the learner to explain a safer alternative.", "कमरे तक दो रास्ते बनाएँ। एक बंद कर दें और सुरक्षित विकल्प समझाने को कहें।", "Room tak 2 routes draw karo. Ek block karke safer option explain karwao."),
  },
  {
    id: "transfer-junior-message", band: "8-10", world: "mystery", icon: "📣",
    title: t("The Surprise Holiday", "अचानक छुट्टी की खबर", "Surprise holiday"),
    situation: t("A bright flyer says 'School holiday tomorrow!' but has no school name, date or official signature.", "रंगीन पर्ची कहती है 'कल छुट्टी!' लेकिन स्कूल का नाम, तारीख़ या आधिकारिक सूचना नहीं है।", "Colourful flyer bolta hai 'Kal holiday!' but school name, date aur official notice missing."),
    question: t("What should you do?", "क्या करना चाहिए?", "Kya karna chahiye?"),
    whyQuestion: t("Which reason supports your decision?", "कौन सा कारण इसे सही बनाता है?", "Kaunsa reason sahi hai?"),
    decisions: [opt("a", "Forward it to everyone", "सबको भेज दें", "Sabko forward karo"), opt("b", "Ask a trusted adult to check the school's official notice", "विश्वसनीय बड़े से स्कूल की आधिकारिक सूचना जाँचने को कहें", "Trusted adult se official notice check karwao"), opt("c", "Believe it because it is colourful", "रंग देखकर भरोसा करें", "Colours ki wajah se believe karo")],
    reasons: [opt("a", "Messages are reliable if many people share them", "कई लोग भेजें तो संदेश सही होता है", "Many shares mean true"), opt("b", "A colourful flyer always has the right date", "रंगीन पर्ची में तारीख़ हमेशा सही होती है", "Colourful flyer always correct"), opt("c", "We need a trusted source and the correct date", "हमें भरोसेमंद स्रोत और सही तारीख़ चाहिए", "Trusted source aur correct date chahiye")],
    correctDecision: "b", correctReason: "c",
    explanation: t("Before sharing surprising news, check a reliable official source and the date.", "चौंकाने वाली खबर भेजने से पहले विश्वसनीय आधिकारिक स्रोत और तारीख़ जाँचें।", "Surprising news share karne se pehle official source aur date check karo."),
    parentActivity: t("Compare a pretend rumour with an official-looking example; ask what information is missing.", "एक काल्पनिक अफवाह और आधिकारिक सूचना के उदाहरण में अंतर पूछें।", "Fictional rumour aur official notice compare karke missing info poochho."),
  },
  {
    id: "transfer-junior-play", band: "8-10", world: "creator", icon: "🎲",
    title: t("One Game, More Friends", "एक खेल, ज़्यादा दोस्त", "Game for everyone"),
    situation: t("A memory-card game can only be played by dragging cards. One friend cannot use dragging.", "याददाश्त वाला खेल सिर्फ़ कार्ड खींचकर खेल सकते हैं। एक दोस्त कार्ड नहीं खींच सकता।", "Memory card game dragging-only hai. Ek friend drag nahi kar sakta."),
    question: t("What is a helpful change?", "कौन सा बदलाव मदद करेगा?", "Kaunsa change helpful hoga?"),
    whyQuestion: t("Why is this a good design?", "यह डिज़ाइन अच्छा क्यों है?", "Ye design achha kyon hai?"),
    decisions: [opt("a", "Let players tap two cards instead of dragging", "खींचने के बजाय दो कार्ड टैप करने दें", "Dragging ki jagah two-card tap allow karo"), opt("b", "Make dragging faster", "कार्ड और तेज़ खींचने पड़ें", "Dragging aur fast karwao"), opt("c", "Remove the friend from the game", "उस दोस्त को खेल से हटाएँ", "Friend ko game se remove karo")],
    reasons: [opt("a", "Only fast players should win", "सिर्फ़ तेज़ खिलाड़ी खेलें", "Only fast players should play"), opt("b", "It preserves the memory goal while offering another way to interact", "याद रखने का लक्ष्य वही रहता है लेकिन खेलने का दूसरा तरीका मिलता है", "Same memory goal rahega with another control option"), opt("c", "Every game must use dragging", "हर खेल में खींचना ज़रूरी है", "Every game needs dragging")],
    correctDecision: "a", correctReason: "b",
    explanation: t("Accessible controls help more people join without changing the learning goal.", "सुलभ कंट्रोल से ज़्यादा लोग खेल सकते हैं, सीखने का लक्ष्य वही रहता है।", "Accessible controls se more people join with same learning goal."),
    parentActivity: t("Try a home game two different ways—pointing and speaking—and discuss who each way helps.", "घर का खेल इशारा करके और बोलकर खेलें, फिर पूछें किसे मदद हुई।", "Home game pointing aur speaking se play karo; discuss kaun benefit karta hai."),
  },
  {
    id: "transfer-middle-plan", band: "11-13", world: "logic", icon: "🛰️",
    title: t("The Power-Cut Project", "बिजली जाने वाला प्रोजेक्ट", "Power-cut project"),
    situation: t("Your team's demo uses a video. The venue may lose power, and you have one day to prepare.", "टीम का डेमो वीडियो पर है। जगह पर बिजली जा सकती है और तैयारी के लिए एक दिन है।", "Team ka demo video-based hai. Venue pe power cut risk hai; one day left."),
    question: t("Which action best handles the risk?", "जोखिम से निपटने का अच्छा कदम कौन सा है?", "Risk handle karne ka best action?"),
    whyQuestion: t("What makes it the strongest choice?", "इसे अच्छा विकल्प क्या बनाता है?", "Ye strongest choice kyon hai?"),
    decisions: [opt("a", "Practise an unplugged paper-based demonstration", "बिना बिजली वाला कागज़ी डेमो अभ्यास करें", "No-power paper demo practise karo"), opt("b", "Wait to see if power fails", "बिजली जाने का इंतज़ार करें", "Power fail hone ka wait karo"), opt("c", "Make the video longer", "वीडियो लंबा बना दें", "Video aur long banao")],
    reasons: [opt("a", "A longer video is always clearer", "लंबा वीडियो हमेशा बेहतर है", "Long video always better"), opt("b", "Testing a fallback reduces a known dependency", "वैकल्पिक तरीका जाँचने से जोखिम कम होता है", "Tested fallback dependency risk reduce karta hai"), opt("c", "Planning does not matter when the deadline is close", "समय कम हो तो योजना ज़रूरी नहीं", "Deadline pe planning unnecessary")],
    correctDecision: "a", correctReason: "b",
    explanation: t("Good teams test a backup plan for a likely failure, then explain any limits.", "अच्छी टीम संभावित बाधा के लिए वैकल्पिक तरीका जाँचती है और सीमाएँ बताती है।", "Good team likely failure ke liye backup test karti hai."),
    parentActivity: t("Plan a no-electricity five-minute presentation about a favourite subject.", "पसंदीदा विषय पर पाँच मिनट का बिना बिजली वाला प्रस्तुतीकरण बनाएँ।", "Favourite topic ka 5-minute no-power presentation banao."),
  },
  {
    id: "transfer-middle-evidence", band: "11-13", world: "mystery", icon: "📊",
    title: t("The Poll With Missing Voices", "सर्वे में गायब लोगों की आवाज़", "Poll with missing voices"),
    situation: t("A school poll asks only chess-club members whether every student likes chess, then prints 'Everyone loves chess'.", "स्कूल सर्वे सिर्फ़ शतरंज क्लब से पूछता है और लिखता है 'सब शतरंज पसंद करते हैं'।", "School poll sirf chess club se poochta hai, then claims 'Everyone loves chess'."),
    question: t("What's the responsible conclusion?", "जिम्मेदार निष्कर्ष क्या होगा?", "Responsible conclusion kya hai?"),
    whyQuestion: t("What evidence issue matters?", "कौन सी प्रमाण संबंधी समस्या है?", "Evidence mein kya issue hai?"),
    decisions: [opt("a", "Say the poll proves all students like chess", "कहें कि सभी छात्र शतरंज पसंद करते हैं", "Poll proves everyone likes chess"), opt("b", "State only that the surveyed chess-club members responded", "केवल पूछे गए शतरंज क्लब सदस्यों की बात बताएँ", "Only surveyed chess club members ki response batao"), opt("c", "Delete the survey data", "सर्वे डेटा मिटा दें", "Survey data delete karo")],
    reasons: [opt("a", "The sample did not include other students", "नमूने में दूसरे विद्यार्थी शामिल नहीं थे", "Sample mein other students nahi the"), opt("b", "Chess is too complicated", "शतरंज बहुत कठिन है", "Chess is difficult"), opt("c", "Any survey of one club represents every school", "एक क्लब पूरे स्कूल का प्रतिनिधित्व करता है", "One club means whole school")],
    correctDecision: "b", correctReason: "a",
    explanation: t("A sample from one interest group cannot represent a whole school without further evidence.", "एक रुचि-समूह का नमूना बिना अतिरिक्त प्रमाण पूरे स्कूल का प्रतिनिधित्व नहीं करता।", "One interest group ka sample whole school represent nahi karta."),
    parentActivity: t("Compare opinions from two different groups and discuss who was not surveyed.", "दो अलग समूहों की राय लेकर पूछें किससे नहीं पूछा गया।", "2 groups ki opinions compare karo and missing people identify karo."),
  },
  {
    id: "transfer-middle-design", band: "11-13", world: "creator", icon: "🧰",
    title: t("A Helpful Study Assistant", "सहायक स्टडी असिस्टेंट", "Helpful study assistant"),
    situation: t("An AI learning tool gives complete homework answers instantly. Learners stop checking their own work.", "AI टूल तुरंत पूरे गृहकार्य के उत्तर देता है। विद्यार्थी अपना काम जाँचना बंद कर देते हैं।", "AI tool instant homework answers deta hai; learners self-check band kar dete hain."),
    question: t("Which redesign best supports learning?", "सीखने में कौन सा बदलाव मदद करेगा?", "Learning ke liye best redesign?"),
    whyQuestion: t("Why would that help?", "यह क्यों मदद करेगा?", "Ye helpful kyon hoga?"),
    decisions: [opt("a", "Show hints and ask students to try before revealing an explanation", "पहले संकेत और अपना प्रयास, फिर स्पष्टीकरण दें", "Hints aur self-attempt first, explanation later"), opt("b", "Hide all feedback", "सभी फीडबैक छिपा दें", "All feedback hide karo"), opt("c", "Give answers even faster", "उत्तर और तेज़ दें", "Answers aur fast do")],
    reasons: [opt("a", "Fast copying proves mastery", "जल्दी नकल करना समझने का प्रमाण है", "Fast copying proves mastery"), opt("b", "Students should never receive help", "विद्यार्थियों को मदद नहीं मिलनी चाहिए", "Students should never get help"), opt("c", "Attempts and feedback encourage checking and revising thinking", "प्रयास और फीडबैक से सोचने और सुधारने की आदत बनती है", "Attempts aur feedback thinking revise karne mein help karte hain")],
    correctDecision: "a", correctReason: "c",
    explanation: t("A learning tool should scaffold thinking, not replace every student decision.", "सीखने वाला टूल सोचने में मदद करे, हर निर्णय अपने आप न ले।", "Learning tool thinking support kare, decisions replace na kare."),
    parentActivity: t("Take a homework question and write one useful hint instead of the final answer.", "एक सवाल का अंतिम जवाब देने की बजाय उपयोगी संकेत लिखें।", "Homework question ka final answer nahi, helpful hint likho."),
  },
  {
    id: "transfer-teen-decision", band: "14-17", world: "logic", icon: "🔌",
    title: t("Launch Under Constraints", "सीमाओं में प्रोजेक्ट लॉन्च", "Launch under constraints"),
    situation: t("A school data project goes live tomorrow. A chart relies on a service with frequent outages. The project must work offline.", "स्कूल डेटा प्रोजेक्ट कल लॉन्च है। चार्ट अक्सर बंद होने वाली सेवा पर निर्भर है, जबकि ऑफलाइन चलना ज़रूरी है।", "School data project launch kal hai. Chart unreliable service pe hai, but offline work required."),
    question: t("What is the most defensible action?", "सबसे उचित कदम क्या है?", "Most defensible action kya hai?"),
    whyQuestion: t("What is the underlying principle?", "इसके पीछे क्या सिद्धांत है?", "Underlying principle kya hai?"),
    decisions: [opt("a", "Prepare a validated local chart and test the offline path", "जाँचा हुआ लोकल चार्ट बनाएँ और ऑफलाइन टेस्ट करें", "Validated local chart banao aur offline test karo"), opt("b", "Ignore the outage history", "सेवा बंद होने के इतिहास को अनदेखा करें", "Outage history ignore karo"), opt("c", "Remove all data labels", "डेटा के सभी लेबल हटा दें", "Data labels remove karo")],
    reasons: [opt("a", "More visual effects hide downtime", "ज़्यादा इफेक्ट से सेवा बंद होना छिपता है", "Visual effects hide downtime"), opt("b", "Evidence-backed fallback testing reduces dependency risk", "जाँचा हुआ वैकल्पिक रास्ता निर्भरता का जोखिम घटाता है", "Tested fallback reduces dependency risk"), opt("c", "Offline requirements are optional", "ऑफलाइन आवश्यकता वैकल्पिक है", "Offline requirement optional hai")],
    correctDecision: "a", correctReason: "b",
    explanation: t("Evaluate real constraints, validate a fallback and communicate trade-offs before deployment.", "असल सीमाएँ जाँचें, वैकल्पिक तरीका टेस्ट करें और लॉन्च से पहले समझौते स्पष्ट करें।", "Real constraints evaluate karo, fallback test karo, tradeoffs communicate karo."),
    parentActivity: t("Audit a household app's offline behaviour; list one failure and a practical fallback.", "घर के ऐप का ऑफलाइन उपयोग जाँचें; एक समस्या और विकल्प लिखें।", "Home app ka offline behavior test karo, ek fallback note karo."),
  },
  {
    id: "transfer-teen-study", band: "14-17", world: "mystery", icon: "🧪",
    title: t("The Study-App Claim", "स्टडी ऐप का दावा", "Study-app claim"),
    situation: t("Two groups average 82 and 73 on a test. One used an app, but students chose whether to use it; study hours were not recorded.", "दो समूहों के औसत अंक 82 और 73 हैं। ऐप स्वयं चुना गया और पढ़ाई के घंटे दर्ज नहीं हुए।", "Two groups average 82 and 73. App self-selected tha, study hours record nahi hue."),
    question: t("Which conclusion fits the data?", "डेटा किस निष्कर्ष को समर्थन देता है?", "Data kis conclusion ko support karta hai?"),
    whyQuestion: t("Why should the conclusion be limited?", "निष्कर्ष सीमित क्यों होना चाहिए?", "Conclusion limited kyon hona chahiye?"),
    decisions: [opt("a", "The app must have caused the higher average", "ऐप ने ही औसत अंक बढ़ाए", "App caused higher average"), opt("b", "The groups differed; a causal effect is not established", "समूहों में अंतर था, कारण सिद्ध नहीं", "Groups differ but cause not established"), opt("c", "The other group could not learn", "दूसरा समूह सीख नहीं सकता", "Other group cannot learn")],
    reasons: [opt("a", "Self-selection and missing study-hour data could affect the comparison", "स्वयं चयन और पढ़ाई के घंटे अंतर के दूसरे कारण हो सकते हैं", "Self-selection aur study hours comparison affect kar sakte hain"), opt("b", "A difference in averages always proves causation", "औसत का अंतर हमेशा कारण सिद्ध करता है", "Average difference always proves cause"), opt("c", "Large numbers need no explanation", "बड़ी संख्याओं को स्पष्टीकरण नहीं चाहिए", "Big numbers need no explanation")],
    correctDecision: "b", correctReason: "a",
    explanation: t("Association is not causation. Selection effects and unmeasured study habits are plausible confounders.", "संबंध कारण नहीं साबित करता। समूह चयन और अनमापी पढ़ाई की आदतें अंतर ला सकती हैं।", "Association causation nahi. Selection aur study habits confound kar sakte hain."),
    parentActivity: t("Find a headline with a comparison and ask what other factors might explain the numbers.", "तुलना वाली खबर ढूँढें और पूछें अन्य कौन से कारण हो सकते हैं।", "Comparison headline choose karo and possible confounders identify karo."),
  },
  {
    id: "transfer-teen-access", band: "14-17", world: "creator", icon: "🧭",
    title: t("Accessible Event Planner", "सुलभ इवेंट प्लानर", "Accessible event planner"),
    situation: t("A student event form relies on tiny grey text and colour-only error indicators. Several testers cannot complete it.", "छात्र इवेंट फॉर्म में बहुत छोटा ग्रे पाठ और सिर्फ़ रंग से त्रुटि दिखती है। कई उपयोगकर्ता फॉर्म नहीं भर पा रहे।", "Student form tiny grey text aur colour-only errors use karta hai; testers fail ho rahe."),
    question: t("What should the designer try next?", "डिज़ाइनर को क्या करना चाहिए?", "Designer next kya kare?"),
    whyQuestion: t("Why is this the best next step?", "यह अच्छा अगला कदम क्यों है?", "Why is this best step?"),
    decisions: [opt("a", "Improve contrast, give text errors, support keyboard use and retest", "कॉन्ट्रास्ट बढ़ाएँ, टेक्स्ट त्रुटि दें, कीबोर्ड चलाएँ और फिर टेस्ट करें", "Contrast, text errors, keyboard, retest"), opt("b", "Add animations without changing the form", "फॉर्म वही रखकर एनिमेशन बढ़ाएँ", "Add animations only"), opt("c", "Assume users are not careful", "मान लें उपयोगकर्ता ध्यान नहीं देते", "Blame users")],
    reasons: [opt("a", "Decoration is the only test of usability", "सजावट ही उपयोगिता का एकमात्र परीक्षण है", "Decoration equals usability"), opt("b", "People should adapt to all design flaws", "हर डिज़ाइन गलती उपयोगकर्ता ही ठीक करें", "People should adapt to flaws"), opt("c", "Remove observed barriers and check real task completion", "देखी गई बाधाएँ घटाकर काम पूरा होने की जाँच करें", "Remove barriers and verify task completion")],
    correctDecision: "a", correctReason: "c",
    explanation: t("Accessibility changes should respond to observed problems and be verified with fresh usability testing.", "सुगम्यता में दिखी समस्याएँ सुधारकर नए उपयोगिता परीक्षण से पुष्टि करें।", "Accessibility issues observed ho toh fix and usability retest karo."),
    parentActivity: t("Inspect a familiar form with the keyboard only and list two changes that make it easier.", "जानी-पहचानी फ़ॉर्म को केवल कीबोर्ड से चलाकर दो सुधार लिखें।", "Form keyboard-only try karo and 2 accessibility improvements suggest karo."),
  },
];

export const TRANSFER_POLICY_VERSION = "local-transfer-v1";
export const TRANSFER_CHALLENGES: readonly TransferChallenge[] = challenges;
export function getTransferChallenges(ageBand: AdventureAgeBand): TransferChallenge[] {
  return challenges.filter(challenge => challenge.band === ageBand);
}
export type TransferAttempt = {
  attempts: number;
  firstCorrect: boolean;
  solved: boolean;
  updatedAt: string;
  /** First submitted pair only; absent in older browser records. Never store selected answers. */
  firstDecisionCorrect?: boolean;
  firstReasonCorrect?: boolean;
};

/** Diagnose the two independent parts without exposing the answer key. */
export function gradeTransferChallenge(challenge: TransferChallenge, decision: string, reason: string) {
  const decisionCorrect = challenge.decisions.some(option => option.id === decision)
    && decision === challenge.correctDecision;
  const reasonCorrect = challenge.reasons.some(option => option.id === reason)
    && reason === challenge.correctReason;
  return { decisionCorrect, reasonCorrect, correct: decisionCorrect && reasonCorrect };
}
export function evaluateTransferChallenge(challenge: TransferChallenge, decision: string, reason: string): boolean {
  return gradeTransferChallenge(challenge, decision, reason).correct;
}
export function submitTransferAttempt(
  previous: TransferAttempt | undefined,
  challenge: TransferChallenge,
  decision: string,
  reason: string,
  at: string,
): TransferAttempt {
  if (previous?.solved) return previous;
  const grade = gradeTransferChallenge(challenge, decision, reason);
  return {
    attempts: Math.min((previous?.attempts ?? 0) + 1, 100),
    firstCorrect: previous ? previous.firstCorrect : grade.correct,
    firstDecisionCorrect: previous ? previous.firstDecisionCorrect : grade.decisionCorrect,
    firstReasonCorrect: previous ? previous.firstReasonCorrect : grade.reasonCorrect,
    solved: Boolean(previous?.solved || grade.correct),
    updatedAt: at,
  };
}
export function summarizeTransfer(ageBand: AdventureAgeBand, saved: Record<string, TransferAttempt>) {
  const entries = getTransferChallenges(ageBand).map(challenge => ({
    challenge,
    attempt: saved[challenge.id] ?? null,
  }));
  const solved = entries.filter(row => row.attempt?.solved).length;
  const independent = entries.filter(row => row.attempt?.firstCorrect).length;
  const completed = entries.length === 3 && solved === entries.length;
  const timestamps = completed ? entries.map(row => Date.parse(row.attempt?.updatedAt ?? "")) : [];
  const valid = timestamps.length === 3 && timestamps.every(time => Number.isFinite(time) && time > 0);
  return {
    total: entries.length,
    attempted: entries.filter(row => row.attempt).length,
    solved,
    firstTry: independent,
    improved: entries.filter(row => row.attempt?.solved && !row.attempt.firstCorrect).length,
    firstActionToRevisit: entries.filter(row => row.attempt?.firstDecisionCorrect === false).length,
    firstReasonToRevisit: entries.filter(row => row.attempt?.firstReasonCorrect === false).length,
    firstPairKnown: entries.filter(row => typeof row.attempt?.firstDecisionCorrect === "boolean"
      && typeof row.attempt?.firstReasonCorrect === "boolean").length,
    completed,
    completedAt: completed && valid ? new Date(Math.max(...timestamps)).toISOString() : null,
    entries,
  };
}
