import type { AdventureMission, Localized } from "./discoveryAdventure";

/**
 * Original age-specific practice scenes. These are instructionally reviewed pilot
 * questions, NOT norm-referenced aptitude measures, IQ scores or career predictors.
 * All feedback is authored locally; no AI API call is needed at runtime.
 */
const t = (en: string, hi: string, hinglish: string): Localized => ({ en, hi, hinglish });
type O = { id: string; label: Localized };
const o = (id: string, en: string, hi: string, hinglish: string): O => ({ id, label: t(en, hi, hinglish) });
type Input = Omit<AdventureMission, "ageBand">;
const junior = (mission: Input): AdventureMission => ({ ...mission, ageBand: "8-10" });
const senior = (mission: Input): AdventureMission => ({ ...mission, ageBand: "14-17" });

export const AGE_ADVENTURE_MISSIONS: AdventureMission[] = [
  // Ages 8–10: tangible characters, short stories, 3–4 moves, concrete feedback.
  junior({
    id: "garden-robot-8-10", world: "logic", skill: "planning", mode: "sequence",
    title: t("Help the Garden Robot", "बगीचे के रोबोट की मदद", "Garden Robot ki help karo"),
    story: t("Robo needs to water a flower. The water tank starts empty!", "रोबो को फूल में पानी देना है, लेकिन टंकी खाली है!", "Robo ko flower water karna hai, tank empty hai!"),
    instruction: t("Tap the steps in a useful order.", "सही क्रम में कदम चुनें।", "Steps ko right order mein tap karo."),
    options: [
      o("a", "Check which flower needs water", "देखें किस फूल को पानी चाहिए", "Check karo kis flower ko water chahiye"),
      o("b", "Fill Robo's tank", "रोबो की टंकी भरें", "Robo ka tank fill karo"),
      o("c", "Water the flower", "फूल को पानी दें", "Flower ko water do"),
      o("d", "Check that the flower got water", "जाँचें कि फूल को पानी मिला", "Check karo flower ko water mila"),
    ], answer: ["a", "b", "c", "d"],
    feedback: t("First check the need, prepare the tool, act, and check the result.", "पहले ज़रूरत देखें, तैयारी करें, काम करें और परिणाम जाँचें।", "Pehle need check, phir ready, action aur final check."),
    hint: t("The empty tank cannot water anything. What should happen before Robo moves?", "खाली टंकी से पानी नहीं मिलेगा। चलने से पहले क्या करना चाहिए?", "Empty tank se water nahi milega. Robo chalne se pehle kya kare?"),
  }),
  junior({
    id: "rainy-bridge-8-10", world: "logic", skill: "flexibility", mode: "single",
    title: t("Oh No, Rain!", "अरे, बारिश!", "Oh no, rain!"),
    story: t("Rain makes the cardboard bridge too slippery for your toy car.", "बारिश से गत्ते का पुल खिलौना कार के लिए फिसलन भरा हो गया है।", "Rain se cardboard bridge toy car ke liye slippery ho gaya."),
    instruction: t("Which plan is safer?", "कौन सी योजना सुरक्षित है?", "Kaunsa plan safer hai?"),
    options: [
      o("a", "Push the toy car faster", "कार तेज़ी से धकेलें", "Toy car fast push karo"),
      o("b", "Choose the dry path and test it", "सूखा रास्ता चुनकर जाँचें", "Dry path choose karke test karo"),
      o("c", "Ignore the slippery bridge", "फिसलन पर ध्यान न दें", "Slippery bridge ignore karo"),
    ], answer: ["b"],
    feedback: t("Changing plans after new information is smart, not a failure.", "नई जानकारी आने पर योजना बदलना समझदारी है, हार नहीं।", "New information par plan change karna smart hai, failure nahi."),
    hint: t("Think about where the wheels will have a better grip.", "सोचें कहाँ पहियों की पकड़ बेहतर होगी।", "Socho wheels ko better grip kahan milegi."),
  }),
  junior({
    id: "pattern-patrol-8-10", world: "logic", skill: "reflection", mode: "single",
    title: t("Pattern Patrol", "पैटर्न पहरेदार", "Pattern Patrol"),
    story: t("A robot draws: star, circle, star, circle, star, star. One shape breaks the pattern.", "रोबोट ने बनाया: तारा, गोला, तारा, गोला, तारा, तारा। एक जगह गलती है।", "Robot ne draw kiya: star, circle, star, circle, star, star. Ek shape wrong hai."),
    instruction: t("Which shape should the LAST star become?", "आख़िरी तारा कौन सा आकार होना चाहिए?", "Last star ko kya banana chahiye?"),
    options: [
      o("a", "Circle", "गोला", "Circle"),
      o("b", "Triangle", "त्रिकोण", "Triangle"),
      o("c", "Another star", "एक और तारा", "Ek aur star"),
    ], answer: ["a"],
    feedback: t("Compare repeated pairs: star then circle. Repair the next step and test the pattern.", "बार-बार आने वाली जोड़ी देखें: तारा, गोला। फिर क्रम सुधारें।", "Repeat pair star-circle hai. Next step repair karo."),
    hint: t("After each star, which shape appeared in the earlier pairs?", "पहली जोड़ियों में हर तारे के बाद कौन सा आकार आया?", "Earlier pairs mein star ke baad kaunsa shape tha?"),
  }),
  junior({
    id: "library-clues-8-10", world: "mystery", skill: "evidence", mode: "multi",
    title: t("Who Borrowed the Book?", "किताब किसने ली?", "Book kisne borrow ki?"),
    story: t("A book is missing. One friend guesses who took it, but there is no proof.", "किताब नहीं मिल रही। एक दोस्त ने अंदाज़ा लगाया कि किसने ली, पर प्रमाण नहीं है।", "Book missing hai. Friend guess kar raha hai, proof nahi hai."),
    instruction: t("Choose TWO fair clues to check.", "जाँचने के लिए दो सही सुराग चुनें।", "DO fair clues choose karo."),
    options: [
      o("a", "Check the library loan record", "पुस्तकालय का रिकॉर्ड देखें", "Library loan record check karo"),
      o("b", "Ask the librarian politely", "लाइब्रेरियन से विनम्रता से पूछें", "Librarian se politely poocho"),
      o("c", "Accuse the quietest child", "सबसे शांत बच्चे पर आरोप लगाएँ", "Quietest child par blame karo"),
      o("d", "Spread a rumour", "अफ़वाह फैलाएँ", "Rumour spread karo"),
    ], answer: ["a", "b"],
    feedback: t("Records and respectful questions provide useful clues. Guessing about people does not.", "रिकॉर्ड और आदर से पूछना उपयोगी है; किसी पर अंदाज़े से आरोप नहीं।", "Records aur respectful questions useful hain; guessing se blame mat karo."),
    hint: t("Look for evidence about the book, not assumptions about a person.", "व्यक्ति के बारे में अंदाज़े नहीं, किताब के प्रमाण ढूँढें।", "Person ko judge nahi, book ka evidence check karo."),
  }),
  junior({
    id: "weather-poster-8-10", world: "mystery", skill: "evidence", mode: "single",
    title: t("Rainy Day Rumour", "बारिश की अफ़वाह", "Rainy Day Rumour"),
    story: t("A poster says 'School closed tomorrow!' but has no date or school name.", "पोस्टर कहता है 'कल स्कूल बंद!' पर तारीख़ और स्कूल का नाम नहीं है।", "Poster bolta hai 'School closed tomorrow!' but date aur school name missing."),
    instruction: t("What should you check first?", "सबसे पहले क्या जाँचेंगे?", "Sabse pehle kya check karoge?"),
    options: [
      o("a", "School's official message", "स्कूल की आधिकारिक सूचना", "School ka official message"),
      o("b", "How colourful the poster is", "पोस्टर कितना रंगीन है", "Poster kitna colourful hai"),
      o("c", "How many friends shared it", "कितने दोस्तों ने शेयर किया", "Kitne friends ne share kiya"),
    ], answer: ["a"],
    feedback: t("A trusted source and the correct date matter more than shares or decoration.", "सही तारीख़ और विश्वसनीय स्रोत, शेयर से ज़्यादा ज़रूरी हैं।", "Official source aur correct date shares se important hain."),
    hint: t("Who is allowed to announce school closures?", "स्कूल बंद होने की घोषणा कौन कर सकता है?", "School closure officially kaun announce karta hai?"),
  }),
  junior({
    id: "mystery-route-8-10", world: "mystery", skill: "explanation", mode: "sequence",
    title: t("Follow the Clue Trail", "सुरागों का रास्ता", "Clue Trail"),
    story: t("A treasure note has a drawing, a number and a place. Don't rush!", "ख़ज़ाने के नोट में चित्र, संख्या और जगह है। जल्दबाज़ी मत करें!", "Treasure note mein picture, number aur place hai. Jaldi mat karo!"),
    instruction: t("Put the detective moves in order.", "जासूसी के कदम क्रम में लगाएँ।", "Detective steps order mein lagao."),
    options: [
      o("a", "Look carefully at the whole note", "पूरा नोट ध्यान से देखें", "Whole note carefully dekho"),
      o("b", "Match the drawing to the map", "चित्र का नक्शे से मिलान करें", "Picture ko map se match karo"),
      o("c", "Check the number at that spot", "उस जगह संख्या जाँचें", "Us spot ka number check karo"),
    ], answer: ["a", "b", "c"],
    feedback: t("Explain what you checked in each step before claiming you found the answer.", "जवाब बताने से पहले हर कदम की जाँच समझाएँ।", "Answer bolne se pehle har check explain karo."),
    hint: t("Before using a clue, make sure you have read all of it.", "सुराग इस्तेमाल करने से पहले पूरा पढ़ें।", "Clue use karne se pehle full read karo."),
  }),
  junior({
    id: "eco-bot-8-10", world: "creator", skill: "creativity", mode: "multi",
    title: t("Build an Eco Helper", "पर्यावरण सहायक बनाएँ", "Eco Helper banao"),
    story: t("You are designing a robot to help kids sort clean paper and plastic.", "आप साफ़ कागज़ और प्लास्टिक अलग करने में बच्चों की मदद करने वाला रोबोट बना रहे हैं।", "Robot bana rahe ho jo clean paper aur plastic sort karne mein help kare."),
    instruction: t("Choose TWO helpful design features.", "दो उपयोगी फीचर चुनें।", "DO helpful features choose karo."),
    options: [
      o("a", "Show a picture of the correct bin", "सही डिब्बे की तस्वीर दिखाए", "Correct bin ki picture dikhaye"),
      o("b", "Let the child check the result", "बच्चे को परिणाम जाँचने दे", "Child ko result check karne de"),
      o("c", "Throw everything into one bin", "सब कुछ एक डिब्बे में डाल दे", "Everything one bin mein daale"),
      o("d", "Hide when it makes a mistake", "गलती होने पर छुप जाए", "Mistake pe hide ho jaye"),
    ], answer: ["a", "b"],
    feedback: t("Helpful tools show information and let people check mistakes.", "अच्छे टूल जानकारी देते हैं और गलती जाँचने देते हैं।", "Good tools information dikhate hain aur mistakes check karwate hain."),
    hint: t("Which features help people learn to sort, not just press buttons?", "कौन से फीचर छँटाई सीखने में मदद करते हैं?", "Kaunse features sorting learn karne mein help karte hain?"),
  }),
  junior({
    id: "friend-directions-8-10", world: "creator", skill: "explanation", mode: "sequence",
    title: t("Teach a New Friend", "नए दोस्त को सिखाएँ", "New friend ko sikhayo"),
    story: t("Your new friend wants to play a matching game but has never tried it.", "नया दोस्त मिलान वाला खेल खेलना चाहता है, लेकिन उसने कभी खेला नहीं।", "New friend matching game play karna chahta hai but new hai."),
    instruction: t("Arrange the friendly teaching steps.", "सिखाने वाले आसान कदम क्रम में लगाएँ।", "Friendly teaching steps order mein lagao."),
    options: [
      o("a", "Explain the goal in one sentence", "लक्ष्य एक वाक्य में बताएँ", "Goal one sentence mein batao"),
      o("b", "Show one example", "एक उदाहरण दिखाएँ", "Ek example dikhao"),
      o("c", "Let the friend try and ask if it makes sense", "दोस्त को आज़माने दें और समझ पूछें", "Friend ko try karwao aur check karo samjha ya nahi"),
    ], answer: ["a", "b", "c"],
    feedback: t("A clear goal, an example and a check help someone learn independently.", "स्पष्ट लक्ष्य, उदाहरण और जाँच से सीखने में मदद होती है।", "Clear goal, example aur check se friend independently learn karega."),
    hint: t("What should someone know before watching your example?", "उदाहरण देखने से पहले दोस्त को क्या जानना चाहिए?", "Example se pehle friend ko kya pata hona chahiye?"),
  }),
  junior({
    id: "playground-redesign-8-10", world: "creator", skill: "flexibility", mode: "single",
    title: t("Make the Game Fairer", "खेल को और अच्छा बनाएँ", "Game ko fair banao"),
    story: t("Your jumping game is fun, but a friend who cannot jump wants to play too.", "आपका कूदने वाला खेल मज़ेदार है, लेकिन एक दोस्त कूद नहीं सकता और वह भी खेलना चाहता है।", "Jumping game fun hai, but ek friend jump nahi kar sakta aur join karna chahta hai."),
    instruction: t("Which change helps more friends join?", "कौन सा बदलाव ज़्यादा दोस्तों को खेलने देगा?", "Kaunsa change sab ko join karne dega?"),
    options: [
      o("a", "Offer a tap-or-point option with the same goal", "उसी लक्ष्य के लिए टैप या इशारे का विकल्प दें", "Same goal ke liye tap-or-point option do"),
      o("b", "Tell that friend to watch", "उस दोस्त को केवल देखने को कहें", "Us friend ko sirf watch karne bolo"),
      o("c", "Make the jumps even harder", "कूदना और कठिन बना दें", "Jump aur hard karo"),
    ], answer: ["a"],
    feedback: t("Redesigning an activity can help more people participate while keeping the learning goal.", "खेल का लक्ष्य बनाए रखते हुए बदलाव से और लोग भाग ले सकते हैं।", "Goal same rakhkar redesign se more friends participate kar sakte hain."),
    hint: t("Can the same idea work with a different kind of movement?", "क्या वही खेल दूसरी तरह की गतिविधि से हो सकता है?", "Same goal different movement se possible hai?"),
  }),

  // Ages 14–17: nuanced contexts, source quality, dependencies and inclusion.
  senior({
    id: "project-dependencies-14-17", world: "logic", skill: "planning", mode: "sequence",
    title: t("Plan a School Showcase", "स्कूल प्रदर्शनी की योजना", "School showcase plan karo"),
    story: t("Your team has 48 hours to present an evidence-backed science prototype. The demo must work even if Wi-Fi fails.", "आपकी टीम के पास प्रमाण-आधारित विज्ञान मॉडल दिखाने के लिए 48 घंटे हैं। वाई-फ़ाई न होने पर भी डेमो चलना चाहिए।", "Team ke paas 48 hours hain science prototype ke liye. Wi-Fi fail ho toh bhi demo chale."),
    instruction: t("Order the steps so dependencies are respected.", "निर्भरता ध्यान में रखकर कदम क्रम में लगाएँ।", "Dependencies dekhke steps order karo."),
    options: [
      o("a", "Define the claim and success criteria", "दावा और सफलता के मानदंड तय करें", "Claim aur success criteria define karo"),
      o("b", "Check sources and select a feasible approach", "स्रोत जाँचकर व्यावहारिक तरीका चुनें", "Sources verify karke feasible approach choose karo"),
      o("c", "Build and test an offline prototype", "ऑफ़लाइन मॉडल बनाएँ और जाँचें", "Offline prototype build aur test karo"),
      o("d", "Present the results and limitations", "परिणाम और सीमाएँ प्रस्तुत करें", "Results aur limitations present karo"),
    ], answer: ["a","b","c","d"],
    feedback: t("Set criteria, investigate, test, then communicate limitations. A polished presentation cannot replace evidence.", "मानदंड, शोध, परीक्षण और सीमाएँ—यही सही क्रम है। सुंदर प्रस्तुति प्रमाण की जगह नहीं ले सकती।", "Criteria, research, testing, phir limitations. Pretty slides evidence nahi hain."),
    hint: t("What must be decided before you can test whether the prototype worked?", "मॉडल सफल हुआ या नहीं जाँचने से पहले क्या तय होना चाहिए?", "Prototype test se pehle success ka meaning define karna hoga?"),
  }),
  senior({
    id: "system-incident-14-17", world: "logic", skill: "flexibility", mode: "sequence",
    title: t("Handle a System Incident", "सिस्टम समस्या सँभालें", "System incident handle karo"),
    story: t("A club website starts showing incorrect event times just before registrations close.", "पंजीकरण बंद होने से ठीक पहले क्लब की वेबसाइट गलत कार्यक्रम समय दिखाने लगी।", "Club website registrations close hone se pehle wrong event times dikha rahi hai."),
    instruction: t("Order the responsible response.", "जिम्मेदार प्रतिक्रिया का क्रम चुनें।", "Responsible response ka order banao."),
    options: [
      o("a", "Stop sharing the unverified timetable", "अपुष्ट समय-सारणी साझा करना रोकें", "Unverified timetable share karna roko"),
      o("b", "Compare with the approved event schedule", "स्वीकृत कार्यक्रम से मिलान करें", "Approved event schedule se compare karo"),
      o("c", "Correct the page and explain the update", "पेज सुधारें और बदलाव स्पष्ट करें", "Page correct karo aur update explain karo"),
      o("d", "Recheck the displayed times", "दिखाए गए समय फिर जाँचें", "Displayed times recheck karo"),
    ], answer: ["a","b","c","d"],
    feedback: t("Contain the misinformation, verify against a source of truth, correct it, and recheck.", "गलत जानकारी रोकें, मूल स्रोत जाँचें, सुधारें, फिर सत्यापन करें।", "Misinformation stop, source verify, correct, phir recheck."),
    hint: t("Before repairing a public error, prevent more people from relying on it.", "सार्वजनिक गलती सुधारने से पहले उसे फैलने से रोकें।", "Fix se pehle wrong information spread hona roko."),
  }),
  senior({
    id: "planning-tradeoffs-14-17", world: "logic", skill: "reflection", mode: "multi",
    title: t("Choose a Resilient Plan", "मज़बूत योजना चुनें", "Resilient plan choose karo"),
    story: t("A research trip may face poor internet and a shorter-than-expected session.", "शोध यात्रा में इंटरनेट कमज़ोर हो सकता है और समय भी घट सकता है।", "Research trip mein poor internet aur less time dono risk hain."),
    instruction: t("Choose TWO changes that improve reliability.", "भरोसा बढ़ाने वाले दो बदलाव चुनें।", "DO changes choose karo jo reliability improve karein."),
    options: [
      o("a", "Prepare an offline checklist", "ऑफ़लाइन चेकलिस्ट तैयार करें", "Offline checklist ready karo"),
      o("b", "Prioritise the minimum evidence to collect", "कम-से-कम ज़रूरी प्रमाण को प्राथमिकता दें", "Minimum essential evidence prioritise karo"),
      o("c", "Assume the internet will always work", "मान लें कि इंटरनेट हमेशा चलेगा", "Assume internet always works"),
      o("d", "Leave all decisions until the last minute", "हर निर्णय अंतिम समय के लिए छोड़ें", "Sab decisions last minute karo"),
    ], answer: ["a","b"],
    feedback: t("Good plans anticipate constraints and prioritise evidence rather than assuming ideal conditions.", "अच्छी योजनाएँ बाधाओं की तैयारी करती हैं, आदर्श परिस्थितियों का अनुमान नहीं लगातीं।", "Good plan constraints sochkar banta hai, ideal conditions assume nahi karta."),
    hint: t("What can your team prepare before leaving, and what truly matters if time runs out?", "जाने से पहले क्या तैयारी हो सकती है और समय कम हो तो क्या सबसे ज़रूरी है?", "Departure se pehle kya ready kar sakte ho? Time kam hua toh essential kya?"),
  }),
  senior({
    id: "correlation-check-14-17", world: "mystery", skill: "evidence", mode: "multi",
    title: t("Correlation or Cause?", "संबंध या कारण?", "Correlation ya cause?"),
    story: t("A post claims: 'Students who use study apps score higher, so the app caused the improvement.' No study design is given.", "पोस्ट कहती है: 'स्टडी ऐप चलाने वालों के अंक ज़्यादा हैं, इसलिए ऐप ही कारण है।' शोध-विधि नहीं बताई गई।", "Post bolti hai study app users score higher, so app causes scores. Study design missing hai."),
    instruction: t("Select TWO questions before accepting that causal claim.", "कारण मानने से पहले दो सवाल चुनें।", "Causal claim accept karne se pehle DO questions choose karo."),
    options: [
      o("a", "Were other differences (like study time) controlled?", "क्या पढ़ाई के समय जैसे अन्य कारण जाँचे गए?", "Study time jaise other factors control hue?"),
      o("b", "How were students selected and compared?", "विद्यार्थी कैसे चुने और तुलना किए गए?", "Students ka selection aur comparison kaise hua?"),
      o("c", "Does the post have a catchy image?", "क्या पोस्ट की तस्वीर आकर्षक है?", "Post ki image catchy hai?"),
      o("d", "How many emojis are in the caption?", "कैप्शन में कितने इमोजी हैं?", "Caption mein kitne emojis hain?"),
    ], answer: ["a","b"],
    feedback: t("Association alone does not establish causation. Study design and alternative explanations matter.", "साथ-साथ दिखना कारण साबित नहीं करता। शोध-विधि और अन्य संभावनाएँ मायने रखती हैं।", "Association alone causation nahi. Study design aur alternatives matter."),
    hint: t("Two groups may differ in ways unrelated to the app. What should a fair comparison check?", "दो समूह ऐप के अलावा और कैसे अलग हो सकते हैं?", "Groups app ke alawa kis tarah different ho sakte hain?"),
  }),
  senior({
    id: "sample-bias-14-17", world: "mystery", skill: "evidence", mode: "single",
    title: t("The Survey Trap", "सर्वे का जाल", "Survey trap"),
    story: t("A survey about public transport asked only members of a cycling club and then reported 'everyone prefers bicycles.'", "यातायात सर्वे में केवल साइकिल क्लब के सदस्यों से पूछा और निष्कर्ष निकाला 'हर कोई साइकिल पसंद करता है।'", "Transport survey ne sirf cycling club se poocha, phir bola everyone prefers bikes."),
    instruction: t("What is the most important concern?", "सबसे महत्वपूर्ण समस्या क्या है?", "Most important concern kya hai?"),
    options: [
      o("a", "The sample does not represent everyone", "नमूना सभी लोगों का प्रतिनिधित्व नहीं करता", "Sample everybody ko represent nahi karta"),
      o("b", "Bicycles cannot be useful", "साइकिल उपयोगी नहीं हो सकती", "Bicycles useful nahi ho sakti"),
      o("c", "Surveys must always have exactly 100 people", "हर सर्वे में ठीक 100 लोग होने चाहिए", "Surveys mein exactly 100 people hone chahiye"),
    ], answer: ["a"],
    feedback: t("Selection bias limits what a survey can generalise about the broader population.", "चयन में पक्षपात होने पर परिणाम पूरी आबादी पर लागू नहीं किए जा सकते।", "Selection bias se results sab logon par generalise nahi kar sakte."),
    hint: t("Who never had a chance to answer this survey?", "किन लोगों को इस सर्वे में बोलने का मौका ही नहीं मिला?", "Kis group ko survey mein answer karne ka chance nahi mila?"),
  }),
  senior({
    id: "ai-citation-audit-14-17", world: "mystery", skill: "explanation", mode: "sequence",
    title: t("Audit an AI Citation", "AI के स्रोत की जाँच", "AI citation audit karo"),
    story: t("An AI summary cites a study with an impressive title, but the link may be fabricated.", "AI सारांश में प्रभावशाली नाम वाला शोध लिखा है, पर लिंक मनगढ़ंत हो सकता है।", "AI summary impressive study cite karta hai but link fake ho sakta hai."),
    instruction: t("Order the investigation before quoting the study.", "शोध उद्धृत करने से पहले जाँच का क्रम बनाएँ।", "Study quote karne se pehle investigation order karo."),
    options: [
      o("a", "Search for the original paper and author", "मूल शोध और लेखक खोजें", "Original paper aur author search karo"),
      o("b", "Confirm the paper actually exists", "पुष्टि करें कि शोध मौजूद है", "Confirm karo paper actually exists"),
      o("c", "Read what the paper actually concludes", "शोध का वास्तविक निष्कर्ष पढ़ें", "Paper ka actual conclusion read karo"),
      o("d", "State the claim with appropriate limitations", "उचित सीमाओं के साथ दावा लिखें", "Claim ko proper limitations ke saath state karo"),
    ], answer: ["a","b","c","d"],
    feedback: t("Citation-shaped text is not evidence until the source exists and supports the claim.", "स्रोत का नाम लिख देना प्रमाण नहीं; स्रोत मौजूद और दावे के अनुरूप होना चाहिए।", "Citation-looking text evidence nahi jab tak original source real aur supportive na ho."),
    hint: t("Before reading a study's conclusions, you must establish that the study is real.", "निष्कर्ष पढ़ने से पहले शोध का वास्तविक होना जाँचें।", "Conclusion read se pehle verify karo study real hai."),
  }),
  senior({
    id: "accessible-study-app-14-17", world: "creator", skill: "creativity", mode: "multi",
    title: t("Design for More Learners", "सबके लिए डिज़ाइन करें", "Design for more learners"),
    story: t("A study app works with a mouse and English text, but some learners use only keyboards or prefer Hindi.", "स्टडी ऐप माउस और अंग्रेज़ी में चलता है, लेकिन कुछ विद्यार्थी केवल कीबोर्ड चलाते हैं या हिंदी पसंद करते हैं।", "Study app mouse aur English only hai, but kuch learners keyboard ya Hindi prefer karte hain."),
    instruction: t("Choose TWO improvements that expand access.", "पहुंच बढ़ाने वाले दो सुधार चुनें।", "DO improvements choose karo jo access improve karein."),
    options: [
      o("a", "Support keyboard navigation and visible focus", "कीबोर्ड नेविगेशन और स्पष्ट फोकस जोड़ें", "Keyboard navigation aur visible focus add karo"),
      o("b", "Provide reviewed Hindi instructions", "जाँचे हुए हिंदी निर्देश दें", "Reviewed Hindi instructions do"),
      o("c", "Use colour as the only signal", "केवल रंग से जानकारी दें", "Only colour ko signal banao"),
      o("d", "Hide accessibility settings", "एक्सेसिबिलिटी सेटिंग छिपाएँ", "Accessibility settings hide karo"),
    ], answer: ["a","b"],
    feedback: t("Accessibility is a functional design requirement. Language and input options help more learners participate.", "एक्सेसिबिलिटी डिज़ाइन का हिस्सा है; भाषा और कंट्रोल के विकल्प ज़्यादा लोगों को मदद देते हैं।", "Accessibility design ka part hai. Language aur input options help more learners."),
    hint: t("Can someone complete the task without a mouse, and understand the instructions?", "क्या कोई बिना माउस काम कर सकता है और निर्देश समझ सकता है?", "Mouse bina use kar sakte hain? Instructions samajh aate hain?"),
  }),
  senior({
    id: "human-checkpoints-14-17", world: "creator", skill: "planning", mode: "sequence",
    title: t("Build a Responsible AI Workflow", "जिम्मेदार AI प्रक्रिया", "Responsible AI workflow banao"),
    story: t("Your club uses AI to draft event notices; wrong dates could confuse hundreds of students.", "क्लब कार्यक्रम सूचना का मसौदा AI से बनाता है; गलत तारीख़ सैकड़ों छात्रों को भ्रमित कर सकती है।", "Club AI se event notice draft karta hai; wrong dates hundreds ko confuse karengi."),
    instruction: t("Set up the safest workflow.", "सबसे सुरक्षित कार्य-प्रवाह का क्रम चुनें।", "Safest workflow ka order set karo."),
    options: [
      o("a", "Gather official dates and venue details", "आधिकारिक तारीख़ और स्थान की जानकारी लें", "Official dates aur venue details collect karo"),
      o("b", "Ask AI for a draft with those details", "AI से इन तथ्यों के आधार पर मसौदा लें", "AI se provided details par draft lo"),
      o("c", "Have a human compare draft against originals", "मानव से मसौदे की मूल सूचना से तुलना कराएँ", "Human se draft originals ke against check karwao"),
      o("d", "Publish the verified notice", "जाँची गई सूचना प्रकाशित करें", "Verified notice publish karo"),
    ], answer: ["a","b","c","d"],
    feedback: t("Humans should verify important details before publishing AI-generated messages.", "AI-निर्मित सूचना प्रकाशित करने से पहले महत्वपूर्ण तथ्यों का मानव सत्यापन ज़रूरी है।", "AI output publish se pehle human verification important hai."),
    hint: t("What source should a reviewer compare the AI draft against?", "समीक्षक AI मसौदे की किस मूल जानकारी से तुलना करेगा?", "Reviewer AI draft ko kis original source se compare karega?"),
  }),
  senior({
    id: "design-feedback-14-17", world: "creator", skill: "reflection", mode: "single",
    title: t("Revise with Evidence", "प्रमाण से सुधारें", "Evidence ke saath revise karo"),
    story: t("Two testers cannot find the 'save' button in your prototype, even though the page looks polished.", "दो जाँचकर्ता आपके सुंदर प्रोटोटाइप में 'सेव' बटन नहीं ढूँढ पा रहे हैं।", "Two testers polished prototype mein save button nahi dhoondh pa rahe."),
    instruction: t("What should you change first?", "सबसे पहले क्या बदलेंगे?", "First kya change karoge?"),
    options: [
      o("a", "Move the button to a clear position and retest", "बटन स्पष्ट जगह रखें और दोबारा जाँचें", "Button visible jagah move karke retest karo"),
      o("b", "Add another decorative animation", "एक और सजावटी एनिमेशन जोड़ें", "Another decorative animation add karo"),
      o("c", "Assume the testers were not paying attention", "मान लें जाँचकर्ता ध्यान नहीं दे रहे थे", "Assume testers careless hain"),
    ], answer: ["a"],
    feedback: t("Usability feedback is evidence. Make a targeted change and test whether it solves the problem.", "उपयोगिता का फीडबैक प्रमाण है। ज़रूरी बदलाव करके दोबारा परीक्षण करें।", "Usability feedback evidence hai. Targeted change karo aur retest karo."),
    hint: t("Focus on what both testers struggled to do, not on what looks impressive.", "दोनों जाँचकर्ताओं को जिस काम में कठिनाई हुई उस पर ध्यान दें।", "Dono testers ko jis task mein issue hua usko focus karo."),
  }),
];
