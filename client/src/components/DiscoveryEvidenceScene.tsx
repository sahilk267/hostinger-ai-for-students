import type { AdventureLocale } from "@/data/discoveryAdventure";

/** Lightweight authored visual evidence. No images, remote assets or game result claims. */
const strings = {
  en: {
    chart: "Visual clue: check the chart scale",
    chartNote: "Sample chart, not real survey data. A = 98 and B = 104. The vertical axis begins at 95.",
    rover: "Visual clue: a rover needs a plan",
    roverNote: "A sample map with a starting point, a research station and a blocked tile. Read the map before choosing a route.",
    poster: "Visual clue: what's hard to find?",
    posterNote: "This fictional poster has a big decoration, but its main instruction is tiny.",
    posterTitle: "SCIENCE DAY",
    posterSmall: "Bring your experiment notes to Lab 3 before Friday.",
    post: "Visual clue: a post without a source",
    postNote: "A fictional social post. Check whether an original study backs up the claim.",
    postTitle: "BREAKING STUDY TIP",
    postClaim: "ONE study trick works for EVERY student!",
    postFooter: "No study link · No sample details",
    start: "START", goal: "LAB", blocked: "BLOCKED",
    axis: "AXIS STARTS AT 95", axisNote: "Illustrative values",
  },
  hi: {
    chart: "चित्र संकेत: चार्ट का पैमाना जाँचें",
    chartNote: "यह नमूना चार्ट है, वास्तविक सर्वे डेटा नहीं। A = 98 और B = 104। अक्ष 95 से शुरू होता है।",
    rover: "चित्र संकेत: रोवर को योजना चाहिए",
    roverNote: "नमूना नक्शा: शुरुआत, शोध केंद्र और बंद रास्ता। रास्ता चुनने से पहले नक्शा देखें।",
    poster: "चित्र संकेत: क्या दिखाई नहीं दे रहा?",
    posterNote: "इस काल्पनिक पोस्टर में सजावट बड़ी है, पर मुख्य निर्देश बहुत छोटा है।",
    posterTitle: "विज्ञान दिवस",
    posterSmall: "शुक्रवार से पहले प्रयोग के नोट्स लैब 3 में लाएँ।",
    post: "चित्र संकेत: बिना स्रोत वाली पोस्ट",
    postNote: "यह काल्पनिक पोस्ट है। देखें कि क्या मूल शोध दावे का समर्थन करता है।",
    postTitle: "पढ़ाई की खबर",
    postClaim: "पढ़ाई की एक तरकीब हर छात्र के लिए काम करती है!",
    postFooter: "शोध का लिंक नहीं · प्रतिभागियों की जानकारी नहीं",
    start: "शुरू", goal: "लैब", blocked: "बंद",
    axis: "अक्ष 95 से शुरू", axisNote: "नमूना आँकड़े",
  },
  hinglish: {
    chart: "Visual clue: chart ka scale dekho",
    chartNote: "Sample chart hai, real survey data nahi. A = 98, B = 104. Axis 95 se start hota hai.",
    rover: "Visual clue: rover ko plan chahiye",
    roverNote: "Sample map mein start point, research lab aur blocked tile hai. Route se pehle map read karo.",
    poster: "Visual clue: kya miss ho raha hai?",
    posterNote: "Is fictional poster par decoration badi hai, main instruction bahut chhota.",
    posterTitle: "SCIENCE DAY",
    posterSmall: "Friday se pehle experiment notes Lab 3 mein lao.",
    post: "Visual clue: source missing!",
    postNote: "Ye fictional post hai. Check karo ki original study is claim ko support karti hai ya nahi.",
    postTitle: "BREAKING STUDY TIP",
    postClaim: "ONE study trick EVERY student ke liye works!",
    postFooter: "Study link missing · Sample details missing",
    start: "START", goal: "LAB", blocked: "CLOSED",
    axis: "AXIS STARTS AT 95", axisNote: "Sample values",
  },
} as const;

type SceneId = "rover-rescue" | "chart-trap" | "viral-claim" | "poster-upgrade";
export function hasAdventureScene(id: string): id is SceneId {
  return id === "rover-rescue" || id === "chart-trap" || id === "viral-claim" || id === "poster-upgrade";
}

export default function DiscoveryEvidenceScene({ missionId, locale }: { missionId: string; locale: AdventureLocale }) {
  if (!hasAdventureScene(missionId)) return null;
  const copy = strings[locale];

  if (missionId === "chart-trap") {
    return <figure className="da-evidence-scene" aria-label={copy.chartNote}>
      <figcaption><strong>📊 {copy.chart}</strong><span>{copy.chartNote}</span></figcaption>
      <svg viewBox="0 0 420 210" role="img" aria-label={copy.chartNote} className="da-chart-svg">
        <rect x="0" y="0" width="420" height="210" rx="15" fill="#f6faff"/>
        <path d="M63 35 V165 H393" stroke="#8d9cb9" strokeWidth="2" fill="none" />
        <path d="M63 40 H387 M63 100 H387 M63 165 H387" stroke="#d4e0f0" strokeDasharray="4 5" strokeWidth="1.5"/>
        <text x="29" y="44" fontSize="12" fill="#546a8c">105</text>
        <text x="29" y="104" fontSize="12" fill="#546a8c">100</text>
        <text x="29" y="169" fontSize="12" fill="#546a8c">95</text>
        <rect x="128" y="125" width="63" height="40" rx="6" fill="#55bea5"/>
        <rect x="262" y="53" width="63" height="112" rx="6" fill="#7f6bd8"/>
        <text x="160" y="117" textAnchor="middle" fontSize="17" fontWeight="800" fill="#1c496c">98</text>
        <text x="293" y="45" textAnchor="middle" fontSize="17" fontWeight="800" fill="#443492">104</text>
        <text x="160" y="186" textAnchor="middle" fontSize="12" fill="#43536f">A</text>
        <text x="293" y="186" textAnchor="middle" fontSize="12" fill="#43536f">B</text>
        <text x="210" y="205" textAnchor="middle" fontSize="10" fontWeight="700" fill="#435f85">{copy.axis}</text>
      </svg>
    </figure>;
  }

  if (missionId === "rover-rescue") {
    const cells = Array.from({ length: 16 }, (_, index) => index);
    return <figure className="da-evidence-scene" aria-label={copy.roverNote}>
      <figcaption><strong>🗺️ {copy.rover}</strong><span>{copy.roverNote}</span></figcaption>
      <div className="da-rover-board" role="img" aria-label={copy.roverNote}>
        {cells.map((cell) => <div key={cell} className={"da-rover-tile" + (cell === 10 ? " is-blocked" : "") + (cell === 12 ? " is-start" : "") + (cell === 3 ? " is-goal" : "")}>
          {cell === 12 ? <><span>🚀</span><small>{copy.start}</small></> : cell === 3 ? <><span>🏁</span><small>{copy.goal}</small></> : cell === 10 ? <><span>⛔</span><small>{copy.blocked}</small></> : <span className="da-tile-dot" />}
        </div>)}
      </div>
    </figure>;
  }

  if (missionId === "viral-claim") {
    return <figure className="da-evidence-scene">
      <figcaption><strong>🕵️ {copy.post}</strong><span>{copy.postNote}</span></figcaption>
      <div className="da-post-scene" role="img" aria-label={copy.postNote}>
        <span>✦ {copy.postTitle}</span><p>{copy.postClaim}</p><small>{copy.postFooter}</small>
      </div>
    </figure>;
  }

  return <figure className="da-evidence-scene">
    <figcaption><strong>🎨 {copy.poster}</strong><span>{copy.posterNote}</span></figcaption>
    <div className="da-poster-scene" role="img" aria-label={copy.posterNote}>
      <span>{copy.posterTitle}</span><div aria-hidden="true">🔭 🌟 🪐</div><small>{copy.posterSmall}</small>
    </div>
  </figure>;
}
