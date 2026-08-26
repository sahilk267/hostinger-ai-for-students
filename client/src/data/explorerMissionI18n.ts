import type { ExplorerLocale } from "./explorerI18n";
import type { ExplorerMission } from "./explorerLab";

type MissionCopy = Pick<ExplorerMission, "title" | "objective" | "scenario" | "task">;

type LocalizedMissionCopy = Partial<Record<ExplorerLocale, MissionCopy>>;

const copyByPrefix: Record<string, LocalizedMissionCopy> = {
  "plan-rescue": {
    hinglish: { title: "Plan ko batao", objective: "Steps ko order karke planning practice karo.", scenario: "Tumhare paas ek chhota kaam hai, par steps mix ho gaye hain.", task: "Pehle kya karoge, phir kya? Apna plan batao." },
    hi: { title: "योजना बचाएँ", objective: "कदमों को क्रम में रखकर योजना बनाना सीखें।", scenario: "आपके पास एक छोटा काम है, लेकिन उसके कदम मिल गए हैं।", task: "पहले क्या करेंगे, फिर क्या? अपनी योजना बनाएं।" },
    en: { title: "Rescue the plan", objective: "Practice planning by putting steps in a useful order.", scenario: "You have a small task, but its steps have been mixed up.", task: "What comes first, and what comes next? Make a plan." },
  },
  "missing-clue": {
    hinglish: { title: "Missing clue", objective: "Claim ko check karne ke liye useful clue dhoondo.", scenario: "Ek message mein ek strong claim hai, lekin proof clear nahi hai.", task: "Kaunsa clue tumhe claim check karne mein help karega?" },
    hi: { title: "गायब संकेत", objective: "दावे की जाँच के लिए उपयोगी संकेत खोजें।", scenario: "एक संदेश में बड़ा दावा है, लेकिन प्रमाण साफ नहीं है।", task: "कौन सा संकेत दावे की जाँच में मदद करेगा?" },
    en: { title: "Find the missing clue", objective: "Look for evidence that helps you check a claim.", scenario: "A message makes a strong claim, but its proof is not clear.", task: "Which clue would help you check the claim?" },
  },
  "three-ways": {
    hinglish: { title: "Teen ideas banao", objective: "Ek problem ke multiple creative solutions socho.", scenario: "Tumhe ek ordinary task ko thoda better banana hai.", task: "Do pieces choose karke ek useful idea build karo." },
    hi: { title: "तीन विचार बनाएं", objective: "एक समस्या के कई रचनात्मक समाधान सोचें।", scenario: "आपको एक साधारण काम को थोड़ा बेहतर बनाना है।", task: "दो हिस्से चुनकर एक उपयोगी विचार बनाएं।" },
    en: { title: "Build three ideas", objective: "Practice creating more than one solution to a problem.", scenario: "You need to make an ordinary task a little better.", task: "Choose two pieces and build one useful idea." },
  },
  "friend-explain": {
    hinglish: { title: "Friend ko samjhao", objective: "Audience ke hisaab se apni explanation badlo.", scenario: "Tum kisi idea ko apne friend ko explain kar rahe ho.", task: "Kis audience ke liye explain karna hai? Uske hisaab se move choose karo." },
    hi: { title: "दोस्त को समझाएँ", objective: "दर्शक के अनुसार अपनी व्याख्या बदलें।", scenario: "आप किसी विचार को अपने दोस्त को समझा रहे हैं।", task: "किस दर्शक के लिए समझाना है? उसी के अनुसार कदम चुनें।" },
    en: { title: "Explain it to a friend", objective: "Adapt an explanation to the person listening.", scenario: "You are explaining an idea to a friend.", task: "Who are you explaining to? Choose a move that fits them." },
  },
  "rule-change": {
    hinglish: { title: "Rule badal gaya", objective: "Naye rule par strategy switch karna practice karo.", scenario: "Game ka rule achanak badal gaya hai.", task: "Purana move repeat na karke naya move choose karo." },
    hi: { title: "नियम बदल गया", objective: "नए नियम पर रणनीति बदलने का अभ्यास करें।", scenario: "खेल का नियम अचानक बदल गया है।", task: "पुराना कदम दोहराने के बजाय नया कदम चुनें।" },
    en: { title: "The rule changed", objective: "Practice switching strategy when the rule changes.", scenario: "The game rule has suddenly changed.", task: "Do not repeat the old move; choose a new one." },
  },
  "try-again": {
    hinglish: { title: "Phir se try karo", objective: "Result dekhkar next attempt improve karo.", scenario: "Pehli try mein kuch unexpected hua.", task: "Kya change karke second try karoge?" },
    hi: { title: "फिर से कोशिश करें", objective: "नतीजा देखकर अगली कोशिश बेहतर करें।", scenario: "पहली कोशिश में कुछ अलग हुआ।", task: "दूसरी कोशिश में क्या बदलेंगे?" },
    en: { title: "Try again", objective: "Use what you noticed to improve a second attempt.", scenario: "Something unexpected happened on the first try.", task: "What would you change for your second try?" },
  },
};

export function getExplorerMissionCopy(mission: ExplorerMission, locale: ExplorerLocale): MissionCopy {
  const prefix = Object.keys(copyByPrefix).find((key) => mission.id.startsWith(key));
  return copyByPrefix[prefix ?? ""]?.[locale] ?? mission;
}
