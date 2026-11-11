import type { AdventureLocale } from "./discoveryAdventure";

type ParentGuideText = {
  navAdventure: string; navJourney: string; introLabel: string; title: string; titleEmphasis: string;
  lead: string; ageGroup: string; language: string; planLabel: string; planTitle: string;
  noEvidence: string; evidence: (attempted:number)=>string; solved: string; session: string;
  activity: string; parentTip: string; ask: string; openReport: string; tryMission: string;
  print: string; trust: string; back: string; feedbackEnglish: string;
};
/** Parent-facing navigation and practice text; never a psychometric assessment. */
export const parentGuideCopy: Record<AdventureLocale, ParentGuideText> = {
  en: {
    navAdventure:"Adventure",navJourney:"My Journey",introLabel:"FOR PARENTS & GUARDIANS",
    title:"See the learning.",titleEmphasis:"Not a label.",
    lead:"Understand what the learner practised, what to explore next, and how to support curiosity at home. No payment, child account or formal test required.",
    ageGroup:"Learning group",language:"Language",planLabel:"FAMILY PRACTICE PLAN",
    planTitle:"Three small sessions. Useful next steps.",
    noEvidence:"No mission results yet, so these are exploratory activities—not personalised conclusions.",
    evidence:n=>`Based on ${n} missions tried in this browser. These are task-specific observations, not natural talent scores.`,
    solved:"solved",session:"SESSION",activity:"10-minute activity",parentTip:"Parent tip",ask:"Ask together",
    openReport:"Open detailed private report",tryMission:"Try a mission",print:"Print family plan",
    trust:"Results stay in this browser and may be shared across learners on the same device. They are editable, not verified, and should never be used for IQ, career or aptitude decisions.",
    back:"Back to My Journey",feedbackEnglish:"Feedback form is currently available in English.",
  },
  hi: {
    navAdventure:"एडवेंचर",navJourney:"मेरी प्रगति",introLabel:"माता-पिता और अभिभावकों के लिए",
    title:"सीखने की प्रगति देखें।",titleEmphasis:"बच्चे पर कोई लेबल नहीं।",
    lead:"जानें कि बच्चे ने किन गतिविधियों का अभ्यास किया, अगला कदम क्या हो सकता है और घर पर उसकी जिज्ञासा को कैसे बढ़ाएँ। कोई भुगतान, बच्चे का खाता या औपचारिक परीक्षा ज़रूरी नहीं है।",
    ageGroup:"आयु समूह",language:"भाषा",planLabel:"परिवार के लिए अभ्यास योजना",
    planTitle:"तीन छोटे सत्र। अगले उपयोगी कदम।",
    noEvidence:"अभी किसी मिशन का परिणाम नहीं है। ये सामान्य अभ्यास हैं, बच्चे के बारे में व्यक्तिगत निष्कर्ष नहीं।",
    evidence:n=>`इस ब्राउज़र में ${n} मिशन आज़माए गए हैं। ये केवल उन्हीं गतिविधियों के अवलोकन हैं, प्राकृतिक प्रतिभा की रेटिंग नहीं।`,
    solved:"हल किए",session:"सत्र",activity:"10 मिनट की गतिविधि",parentTip:"अभिभावक के लिए सुझाव",ask:"साथ में पूछें",
    openReport:"विस्तृत निजी रिपोर्ट देखें",tryMission:"मिशन आज़माएँ",print:"परिवार की योजना प्रिंट करें",
    trust:"ये परिणाम इसी ब्राउज़र में रहते हैं और एक ही डिवाइस पर अलग बच्चों के रिकॉर्ड मिल सकते हैं। ये प्रमाणित नहीं हैं। IQ, करियर या योग्यता के फ़ैसलों के लिए इनका उपयोग न करें।",
    back:"मेरी प्रगति पर लौटें",feedbackEnglish:"फ़ीडबैक फ़ॉर्म फ़िलहाल अंग्रेज़ी में उपलब्ध है।",
  },
  hinglish: {
    navAdventure:"Adventure",navJourney:"My Journey",introLabel:"PARENTS AUR GUARDIANS KE LIYE",
    title:"See the learning.",titleEmphasis:"Not a label.",
    lead:"Samjhiye ki learner ne kya practice kiya, next kya explore kare, aur ghar par curiosity kaise support karein. Payment, child account ya formal test zaroori nahi.",
    ageGroup:"Learning group",language:"Language",planLabel:"FAMILY PRACTICE PLAN",
    planTitle:"Three small sessions. Useful next steps.",
    noEvidence:"No mission results yet — ye general exploratory activities hain, personal talent conclusions nahi.",
    evidence:n=>`Is browser mein ${n} missions try hue. Ye sirf un tasks ke observations hain, natural talent scores nahi.`,
    solved:"solved",session:"SESSION",activity:"10-minute activity",parentTip:"Parent tip",ask:"Saath mein poochhiye",
    openReport:"Detailed private report dekhein",tryMission:"Mission try karein",print:"Family plan print karein",
    trust:"Results isi browser mein hain; shared device par learners ka data mix ho sakta hai. Ye verified nahi hain. IQ, career ya aptitude decide karne ke liye use na karein.",
    back:"My Journey par wapas",feedbackEnglish:"Feedback form filhaal English mein available hai.",
  },
};
