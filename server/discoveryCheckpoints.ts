/**
 * Server-only checkpoints. Deliberately NOT imported into Vite/browser code.
 * These 9 short exercises provide an account-held practice record, NOT a
 * validated aptitude test, proctored examination or certificate.
 */
export type CheckpointBand = "8-10" | "11-13" | "14-17";
export type CheckpointLocale = "en" | "hi" | "hinglish";
type L = Record<CheckpointLocale, string>;
const t = (en: string, hi: string, hinglish: string): L => ({ en, hi, hinglish });
export type Checkpoint = {
  id: string; band: CheckpointBand; world: "logic" | "mystery" | "creator";
  question: L; options: { id: string; text: L }[]; answer: string; explanation: L;
};
const o = (id: string, en: string, hi: string, hinglish: string) => ({ id, text: t(en, hi, hinglish) });
const checkpoints: Checkpoint[] = [
  {
    id:"junior-route",band:"8-10",world:"logic",
    question:t("A robot's water tank is empty. What should it do before watering flowers?","रोबोट की पानी की टंकी खाली है। फूलों को पानी देने से पहले क्या करे?","Robot ka water tank empty hai. Flowers ko water dene se pehle kya kare?"),
    options:[o("a","Fill the tank and check the path","टंकी भरें और रास्ता जाँचें","Tank fill karke path check kare"),o("b","Drive straight into the flowerbed","सीधे फूलों पर चला जाए","Seedha flowers ke upar drive kare"),o("c","Ignore the empty tank","खाली टंकी को अनदेखा करे","Empty tank ignore kare")],answer:"a",
    explanation:t("Plan with the resources you need before starting.","शुरू करने से पहले ज़रूरी सामान और रास्ता जाँचें।","Start se pehle necessary resources aur route check karo.")
  },
  {
    id:"junior-clue",band:"8-10",world:"mystery",
    question:t("A message says school is closed but has no date. What should you trust?","संदेश कहता है स्कूल बंद है, पर तारीख़ नहीं है। किस पर भरोसा करेंगे?","Message bolta hai school closed hai, but date nahi. Kya trust karoge?"),
    options:[o("a","Its bright colours","उसके चमकीले रंग","Bright colours"),o("b","An official, dated school notice","स्कूल की तारीख़ वाली आधिकारिक सूचना","Official dated school notice"),o("c","The number of emoji","इमोजी की संख्या","Emojis ka count")],answer:"b",
    explanation:t("An official source and current date matter more than appearance.","रंग से ज़्यादा आधिकारिक स्रोत और सही तारीख़ महत्वपूर्ण हैं।","Appearance se zyada official source aur date matter.")
  },
  {
    id:"junior-inclusion",band:"8-10",world:"creator",
    question:t("A friend cannot jump but wants to play your game. What's a helpful redesign?","दोस्त कूद नहीं सकता लेकिन खेलना चाहता है। अच्छा बदलाव क्या होगा?","Friend jump nahi kar sakta, par game play karna chahta hai. Kya change kare?"),
    options:[o("a","Ask them to just watch","उन्हें बस देखने को कहें","Sirf watch karne bolo"),o("b","Remove the friend from the game","दोस्त को खेल से हटा दें","Friend ko game se hatao"),o("c","Offer tap or point as another way to play","टैप या इशारे का विकल्प दें","Tap ya point karne ka option do")],answer:"c",
    explanation:t("Different controls can preserve the goal and include more people.","अलग कंट्रोल से खेल का लक्ष्य बनाए रखकर अधिक लोग शामिल हो सकते हैं।","Different controls se same goal aur more inclusion possible hai.")
  },
  {
    id:"middle-planning",band:"11-13",world:"logic",
    question:t("Your rover has limited battery. What's a good first step before crossing unknown terrain?","रोवर की बैटरी कम है। अनजान रास्ते पर जाने से पहले क्या करें?","Rover ki battery limited hai. Unknown path pe jaane se pehle kya kare?"),
    options:[o("a","Inspect the map and plan a safe route","नक्शा देखकर सुरक्षित रास्ता तय करें","Map check karke safe route plan karo"),o("b","Start driving at maximum speed","पूरी रफ़्तार से चलना शुरू करें","Maximum speed se drive karo"),o("c","Turn off the distance display","दूरी की जानकारी बंद करें","Distance display off karo")],answer:"a",
    explanation:t("Gather information and plan before using scarce resources.","सीमित संसाधन इस्तेमाल करने से पहले जानकारी और योजना ज़रूरी है।","Limited resource use se pehle information aur planning chahiye.")
  },
  {
    id:"middle-evidence",band:"11-13",world:"mystery",
    question:t("A viral post claims a study trick works for everyone. What's the strongest first check?","वायरल पोस्ट कहती है पढ़ाई की ट्रिक सब पर काम करती है। पहली सही जाँच क्या है?","Viral post bolti hai study trick sab par works. Best first check kya hai?"),
    options:[o("a","Count how many likes it has","लाइक गिनें","Likes count karo"),o("b","Search for the original study and who was tested","मूल शोध और शामिल लोगों को जाँचें","Original study aur participants check karo"),o("c","Copy the claim into homework","दावे को गृहकार्य में कॉपी करें","Claim homework mein copy karo")],answer:"b",
    explanation:t("Claims need verifiable sources and relevant context.","दावों के लिए जाँचने योग्य स्रोत और सही संदर्भ चाहिए।","Claims ke liye verifiable sources aur context chahiye.")
  },
  {
    id:"middle-feedback",band:"11-13",world:"creator",
    question:t("Your poster is attractive, but testers cannot find the instructions. What revision helps?","पोस्टर सुंदर है, पर निर्देश नहीं मिल रहे। क्या सुधार करें?","Poster nice hai, par instructions visible nahi. Kya improve kare?"),
    options:[o("a","Add another animation","एक और एनिमेशन जोड़ें","Another animation add karo"),o("b","Make the title more decorative","शीर्षक और सजाएँ","Title aur decorate karo"),o("c","Make instructions clearer and retest","निर्देश स्पष्ट कर फिर जाँचें","Instructions clear karke retest karo")],answer:"c",
    explanation:t("Use observed feedback to improve the problem, not just the decoration.","फीडबैक के आधार पर असली समस्या सुधारें, केवल सजावट नहीं।","Feedback se actual problem fix karo, decoration nahi.")
  },
  {
    id:"teen-dependency",band:"14-17",world:"logic",
    question:t("A prototype must work without Wi-Fi. What should happen before the public demonstration?","प्रोटोटाइप बिना वाई-फ़ाई चलना चाहिए। सार्वजनिक डेमो से पहले क्या करें?","Prototype ko Wi-Fi ke bina work karna hai. Public demo se pehle kya kare?"),
    options:[o("a","Only design a colourful slide","केवल रंगीन स्लाइड बनाएँ","Bas colourful slides banao"),o("b","Test the offline workflow and document limitations","ऑफ़लाइन प्रक्रिया जाँचें और सीमाएँ लिखें","Offline workflow test karke limitations note karo"),o("c","Assume the network will always work","मान लें नेटवर्क हमेशा चलेगा","Assume network always works")],answer:"b",
    explanation:t("A credible demonstration tests real constraints and records limitations.","भरोसेमंद डेमो वास्तविक सीमाओं में जाँच कर उनका रिकॉर्ड रखता है।","Credible demo real constraints test karta hai aur limitations batata hai.")
  },
  {
    id:"teen-causation",band:"14-17",world:"mystery",
    question:t("Students using an app have higher scores. Which conclusion is justified without a controlled study?","ऐप इस्तेमाल करने वालों के अंक अधिक हैं। नियंत्रित शोध के बिना क्या निष्कर्ष सही है?","App users ke scores higher hain. Controlled study bina kaunsa conclusion right hai?"),
    options:[o("a","The app must have caused higher scores","ऐप ही अधिक अंकों का कारण है","App hi scores badhane ka reason hai"),o("b","The groups differ, but cause is not established","समूहों में अंतर है पर कारण सिद्ध नहीं","Groups differ, cause prove nahi hui"),o("c","Higher scores prove every student needs the app","अधिक अंक साबित करते हैं कि हर छात्र को ऐप चाहिए","Scores prove everyone needs the app")],answer:"b",
    explanation:t("Correlation alone cannot establish a cause; selection and other factors matter.","संबंध अपने आप कारण सिद्ध नहीं करता; चयन और अन्य बातें मायने रखती हैं।","Correlation se cause prove nahi. Selection aur other factors matter.")
  },
  {
    id:"teen-access",band:"14-17",world:"creator",
    question:t("An app requires a mouse and only has English instructions. What's a useful improvement?","ऐप माउस और सिर्फ़ अंग्रेज़ी से चलता है। उपयोगी सुधार क्या है?","App mouse-only aur English-only hai. Useful improvement kya hai?"),
    options:[o("a","Add keyboard controls and reviewed translations","कीबोर्ड कंट्रोल और जाँचे हुए अनुवाद जोड़ें","Keyboard controls aur reviewed translations add karo"),o("b","Hide accessibility settings","सुगम्यता सेटिंग छिपाएँ","Accessibility settings hide karo"),o("c","Replace all text with colour codes","सारा पाठ केवल रंग से दिखाएँ","Text ko colour-only codes bana do")],answer:"a",
    explanation:t("Inclusive design provides usable inputs and understandable language.","समावेशी डिज़ाइन में उपयुक्त कंट्रोल और समझने योग्य भाषा मिलती है।","Inclusive design useful controls aur clear language provide karta hai.")
  }
];

export function getCheckpoints(band: CheckpointBand, locale: CheckpointLocale) {
  return checkpoints.filter(item=>item.band===band).map(item=>({
    id:item.id,world:item.world,question:item.question[locale],
    options:item.options.map(option=>({id:option.id,label:option.text[locale]}))
  }));
}
export function gradeCheckpoint(band: CheckpointBand, challengeId: string, answerId: string, locale: CheckpointLocale) {
  const item=checkpoints.find(x=>x.id===challengeId && x.band===band);
  if (!item || !item.options.some(o=>o.id===answerId)) return null;
  return { correct:item.answer===answerId, explanation:item.explanation[locale] };
}
export const CHECKPOINT_POLICY="server-checkpoint-preview-v1";
