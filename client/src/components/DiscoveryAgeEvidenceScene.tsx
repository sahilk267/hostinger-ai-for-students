import type { AdventureLocale } from "@/data/discoveryAdventure";

/** Concrete, fictional teaching visuals. No external images, statistics or user tracking. */
const copy = {
  en: {
    garden: "Help Robo plan its watering trip",
    gardenNote: "The flower needs water. Robo's tank is empty. Decide what to do first.",
    gardenStart: "EMPTY TANK", gardenGoal: "FLOWER", gardenTask: "ROBO'S GARDEN",
    pattern: "Spot what breaks the repeat",
    patternNote: "Check the pattern: star, circle, star, circle, star, star.",
    weather: "A poster without a reliable source",
    weatherNote: "An invented notice without a school name or date is not enough evidence.",
    weatherTitle: "SCHOOL CLOSED TOMORROW!", weatherMissing: "No date · No school name",
    survey: "Which people did the survey actually ask?",
    surveyNote: "Fictional survey: only cycling-club members were asked. Results cannot represent everyone.",
    sample: "SURVEY SAMPLE", sampled: "Cycling club members only", missing: "OTHER GROUPS: NOT SAMPLED",
    inclusive: "Can everyone use the study app?",
    inclusiveNote: "The sample screen uses mouse-only controls and has no language choice. Think about access.",
    app: "STUDY APP DEMO", appButton: "Click with mouse", appNote: "English only · Mouse required",
    cause: "A comparison does not prove the cause",
    causeNote: "Illustrative observation: two groups differ. Other study habits were not controlled.",
    causeA: "App users", causeB: "Other students", causeLabel: "Reported scores — example only",
  },
  hi: {
    garden: "रोबो के पानी देने की योजना बनाएँ",
    gardenNote: "फूल को पानी चाहिए। रोबो की टंकी खाली है। पहले क्या करेंगे?",
    gardenStart: "खाली टंकी", gardenGoal: "फूल", gardenTask: "रोबो का बगीचा",
    pattern: "दोहराते क्रम में गलती ढूँढें",
    patternNote: "क्रम देखें: तारा, गोला, तारा, गोला, तारा, तारा।",
    weather: "बिना भरोसेमंद स्रोत का पोस्टर",
    weatherNote: "स्कूल का नाम या तारीख़ न देने वाली काल्पनिक सूचना पर्याप्त प्रमाण नहीं है।",
    weatherTitle: "कल स्कूल बंद!", weatherMissing: "तारीख़ नहीं · स्कूल का नाम नहीं",
    survey: "सर्वे में वास्तव में किनसे पूछा गया?",
    surveyNote: "काल्पनिक सर्वे: केवल साइकिल क्लब से पूछा। परिणाम सभी का प्रतिनिधित्व नहीं करते।",
    sample: "सर्वे का नमूना", sampled: "केवल साइकिल क्लब", missing: "अन्य समूह: शामिल नहीं",
    inclusive: "क्या सभी स्टडी ऐप इस्तेमाल कर सकते हैं?",
    inclusiveNote: "नमूना स्क्रीन केवल माउस और अंग्रेज़ी में काम करती है। पहुँच के बारे में सोचें।",
    app: "स्टडी ऐप डेमो", appButton: "माउस से क्लिक करें", appNote: "केवल अंग्रेज़ी · माउस ज़रूरी",
    cause: "दो समूहों का अंतर कारण नहीं साबित करता",
    causeNote: "नमूना तुलना: दो समूहों में अंतर है। पढ़ाई की अन्य आदतों की जाँच नहीं हुई।",
    causeA: "ऐप उपयोगकर्ता", causeB: "अन्य विद्यार्थी", causeLabel: "नमूना अंक — वास्तविक डेटा नहीं",
  },
  hinglish: {
    garden: "Robo ki watering trip plan karo",
    gardenNote: "Flower ko water chahiye, Robo ka tank empty hai. First kya hoga?",
    gardenStart: "EMPTY TANK", gardenGoal: "FLOWER", gardenTask: "ROBO'S GARDEN",
    pattern: "Repeating pattern ki mistake dhoondo",
    patternNote: "Pattern dekho: star, circle, star, circle, star, star.",
    weather: "Source ke bina poster",
    weatherNote: "Ye fictional school notice hai. Date aur school name missing hain.",
    weatherTitle: "SCHOOL CLOSED TOMORROW!", weatherMissing: "Date missing · School name missing",
    survey: "Survey mein actual mein kaun included tha?",
    surveyNote: "Fictional survey sirf cycling club se hua. Results sabko represent nahi karte.",
    sample: "SURVEY SAMPLE", sampled: "Only cycling club", missing: "OTHER GROUPS: NOT SAMPLED",
    inclusive: "Kya sab study app use kar sakte hain?",
    inclusiveNote: "Sample screen mouse-only aur English-only hai. Access ke baare mein socho.",
    app: "STUDY APP DEMO", appButton: "Mouse se click karo", appNote: "English only · Mouse required",
    cause: "Groups ka difference cause prove nahi karta",
    causeNote: "Illustrative comparison: 2 groups differ. Other study habits control nahi hue.",
    causeA: "App users", causeB: "Other students", causeLabel: "Example scores only — real data nahi",
  },
} as const;

export default function DiscoveryAgeEvidenceScene({ missionId, locale }: { missionId: string; locale: AdventureLocale }) {
  const t = copy[locale];
  if (missionId === "garden-robot-8-10") {
    return <figure className="da-evidence-scene da-junior-scene">
      <figcaption><strong>🤖 {t.garden}</strong><span>{t.gardenNote}</span></figcaption>
      <div className="da-garden-scene" role="img" aria-label={t.gardenNote}>
        <div><span aria-hidden="true">🤖</span><small>{t.gardenStart}</small></div>
        <span className="da-garden-path" aria-hidden="true">➜ ➜ ➜</span>
        <div><span aria-hidden="true">🌻</span><small>{t.gardenGoal}</small></div>
      </div>
    </figure>;
  }
  if (missionId === "pattern-patrol-8-10") {
    return <figure className="da-evidence-scene da-junior-scene">
      <figcaption><strong>🌟 {t.pattern}</strong><span>{t.patternNote}</span></figcaption>
      <div className="da-pattern-scene" role="img" aria-label={t.patternNote}>
        {["⭐", "⚪", "⭐", "⚪", "⭐", "⭐"].map((shape, index) => <div key={index}><span>{shape}</span><small>{index + 1}</small></div>)}
      </div>
    </figure>;
  }
  if (missionId === "weather-poster-8-10") {
    return <figure className="da-evidence-scene da-junior-scene">
      <figcaption><strong>📰 {t.weather}</strong><span>{t.weatherNote}</span></figcaption>
      <div className="da-notice-scene" role="img" aria-label={t.weatherNote}><span>🌧️</span><strong>{t.weatherTitle}</strong><small>{t.weatherMissing}</small></div>
    </figure>;
  }
  if (missionId === "sample-bias-14-17") {
    return <figure className="da-evidence-scene da-teen-scene">
      <figcaption><strong>📊 {t.survey}</strong><span>{t.surveyNote}</span></figcaption>
      <div className="da-sample-scene" role="img" aria-label={t.surveyNote}>
        <strong>{t.sample}</strong><div className="da-sample-icons" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <span key={i}>🚲</span>)}</div>
        <small>{t.sampled}</small><div className="da-missing-sample">⚠ {t.missing}</div>
      </div>
    </figure>;
  }
  if (missionId === "accessible-study-app-14-17") {
    return <figure className="da-evidence-scene da-teen-scene">
      <figcaption><strong>♿ {t.inclusive}</strong><span>{t.inclusiveNote}</span></figcaption>
      <div className="da-app-scene" role="img" aria-label={t.inclusiveNote}><span>▦ {t.app}</span><div aria-hidden="true">📚</div><strong>{t.appButton}</strong><small>{t.appNote}</small></div>
    </figure>;
  }
  if (missionId === "correlation-check-14-17") {
    return <figure className="da-evidence-scene da-teen-scene">
      <figcaption><strong>🔬 {t.cause}</strong><span>{t.causeNote}</span></figcaption>
      <div className="da-comparison-scene" role="img" aria-label={t.causeNote}>
        <div><span>{t.causeA}</span><strong>82</strong><i style={{ width: "82%" }} /></div>
        <div><span>{t.causeB}</span><strong>73</strong><i style={{ width: "73%" }} /></div>
        <small>{t.causeLabel}</small>
      </div>
    </figure>;
  }
  return null;
}
