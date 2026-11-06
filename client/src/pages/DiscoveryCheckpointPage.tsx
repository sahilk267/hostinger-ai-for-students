import { useState } from "react";
import { ArrowLeft, CheckCircle2, CircleHelp, LockKeyhole, ShieldCheck, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import LocalAuthDialog from "@/components/LocalAuthDialog";
import type { AdventureAgeBand, AdventureLocale } from "@/data/discoveryAdventure";
import "./discoveryCheckpoint.css";

const copy = {
  en: {
    eyebrow:"SERVER-CHECKED PRACTICE · LIMITED PREVIEW",title:"Practice checkpoint",
    intro:"Three extra, server-checked questions per age group. Account-held records, not a verified learner certificate or an aptitude test.",
    disabled:"This feature is currently disabled until safeguarding and deployment checks are complete.",
    signin:"Sign in with an account to continue", owner:"Adult account holder acknowledgement",
    consent:"I confirm I am an adult account holder using this limited preview. I understand that this does not verify parental identity, and these results do not belong to an identified child.",
    start:"Show checkpoint questions", age:"Choose practice age band", language:"Language",
    progress:"Account checkpoint progress",submit:"Check answer", solved:"Solved",pending:"Not solved yet",
    already:"Already recorded as solved", limit:"Attempt limit reached for this checkpoint. This preview is not a formal test.",
    note:"Only an account ID, age band, checkpoint ID, attempt count and completion time are stored. No child name, DOB, raw answer or free-text response is saved.",
    warning:"A single adult account may be shared by multiple learners. Results must not be attributed to a specific child.",
    clear:"Delete my checkpoint records", confirm:"Permanently delete your account's checkpoint preview records?",
    clearDone:"Records deleted.", error:"Something went wrong. Try again.",
    incomplete:"Keep practising. These three checkpoints do not unlock a certificate.",
    complete:"All three practice checkpoints solved. This is an account-held checkpoint milestone, not an accredited or identity-verified certificate.",
    back:"Back to adventure", disclaimer:"Do not use this preview to make career or aptitude decisions.",
  },
  hi: {
    eyebrow:"सर्वर-जाँच अभ्यास · सीमित डेमो",title:"अभ्यास जाँच",
    intro:"हर आयु वर्ग के लिए तीन अतिरिक्त सर्वर-जाँच सवाल। यह प्रमाणित क्षमता या विद्यार्थी की पहचान का प्रमाणपत्र नहीं है।",
    disabled:"सुरक्षा और डिप्लॉयमेंट समीक्षा पूरी होने तक यह सुविधा बंद है।",
    signin:"जारी रखने के लिए अकाउंट से लॉग इन करें",owner:"वयस्क अकाउंट धारक की स्वीकृति",
    consent:"मैं पुष्टि करता/करती हूँ कि मैं वयस्क अकाउंट धारक हूँ। मैं समझता/समझती हूँ कि यह अभिभावक की पहचान का सत्यापन नहीं है और परिणाम किसी पहचाने गए बच्चे से नहीं जुड़े हैं।",
    start:"अभ्यास के सवाल देखें",age:"अभ्यास आयु वर्ग चुनें",language:"भाषा",
    progress:"अकाउंट की अभ्यास प्रगति",submit:"उत्तर जाँचें",solved:"सही हल हुआ",pending:"अभी सही हल नहीं हुआ",
    already:"सही उत्तर का रिकॉर्ड पहले से है",limit:"इस सवाल के प्रयासों की सीमा पूरी हुई। यह औपचारिक परीक्षा नहीं है।",
    note:"केवल अकाउंट ID, आयु वर्ग, सवाल ID, प्रयास संख्या और पूर्णता समय रखा जाता है। बच्चे का नाम, जन्मतिथि या कच्चा उत्तर नहीं।",
    warning:"एक वयस्क अकाउंट पर कई विद्यार्थी अभ्यास कर सकते हैं। रिकॉर्ड किसी खास बच्चे से नहीं जोड़ा जा सकता।",
    clear:"अकाउंट के अभ्यास रिकॉर्ड मिटाएँ",confirm:"क्या आप अपने अकाउंट के सभी अभ्यास जाँच रिकॉर्ड हमेशा के लिए मिटाना चाहते हैं?",
    clearDone:"रिकॉर्ड मिट गए।",error:"कुछ समस्या आई, फिर कोशिश करें।",
    incomplete:"अभ्यास जारी रखें। इन तीन सवालों से प्रमाणपत्र नहीं मिलता।",
    complete:"तीनों सवाल सही हुए। यह अकाउंट का अभ्यास रिकॉर्ड है, मान्यता प्राप्त या पहचान-सत्यापित प्रमाणपत्र नहीं।",
    back:"एडवेंचर में वापस",disclaimer:"इस डेमो से करियर या क्षमता के निर्णय न लें।",
  },
  hinglish: {
    eyebrow:"SERVER-CHECKED PRACTICE · LIMITED PREVIEW",title:"Practice checkpoint",
    intro:"Har age group ke liye 3 extra server-checked questions. Ye verified student certificate ya aptitude test nahi hai.",
    disabled:"Safety aur deployment review complete hone tak feature disabled hai.",
    signin:"Continue karne ke liye sign in karo",owner:"Adult account holder acknowledgement",
    consent:"Main confirm karta/karti hoon ki main adult account holder hoon. Ye parent identity verification nahi hai, aur results identified child ke naam par nahi hain.",
    start:"Checkpoint questions dekho",age:"Age band choose karo",language:"Language",
    progress:"Account practice progress",submit:"Answer check karo",solved:"Solved",pending:"Abhi solve nahi hua",
    already:"Already solved record hai",limit:"Is checkpoint ki attempt limit reached. Ye formal test nahi hai.",
    note:"Sirf account ID, age band, checkpoint ID, attempts aur completion time save hote hain. Child name, DOB aur raw answers save nahi hote.",
    warning:"Ek adult account ko multiple learners use kar sakte hain. Results kisi particular child ke naam se claim nahi kar sakte.",
    clear:"Account practice records delete karo",confirm:"Account ke saare checkpoint records permanently delete karein?",
    clearDone:"Records deleted.",error:"Issue aaya. Please retry.",
    incomplete:"Practice continue karo. In 3 checkpoints se certificate nahi milta.",
    complete:"Teeno practice checkpoints solved. Ye account-held milestone hai, accredited ya identity-verified certificate nahi.",
    back:"Adventure par wapas",disclaimer:"Is preview se aptitude ya career decisions mat lo.",
  }
} as const;

export default function DiscoveryCheckpointPage() {
  const { isAuthenticated, loading } = useAuth();
  const [ageBand,setAgeBand]=useState<AdventureAgeBand>("11-13");
  const [locale,setLocale]=useState<AdventureLocale>("hinglish");
  const [adultAcknowledged,setAdultAcknowledged]=useState(false);
  const [choice,setChoice]=useState<Record<string,string>>({});
  const [messages,setMessages]=useState<Record<string,string>>({});
  const [notice,setNotice]=useState("");
  const words=copy[locale];
  const status=trpc.discoveryCheckpoint.status.useQuery();
  const enabled=status.data?.enabled===true;
  const permitted=enabled && isAuthenticated && adultAcknowledged;
  const challenges=trpc.discoveryCheckpoint.challenges.useQuery({ageBand,locale},{enabled:permitted,staleTime:60000,retry:false});
  const progress=trpc.discoveryCheckpoint.progress.useQuery(undefined,{enabled:permitted,retry:false});
  const utils=trpc.useUtils();
  const submit=trpc.discoveryCheckpoint.submit.useMutation({
    onSuccess:async(result,variables)=>{
      setMessages(previous=>({...previous,[variables.challengeId]:result.limitReached?words.limit:(result.correct?"✓ "+words.solved+": ":"")+(result.explanation||"")}));
      await utils.discoveryCheckpoint.progress.invalidate();
    },
    onError:(err)=>setNotice(err.message||words.error),
  });
  const clear=trpc.discoveryCheckpoint.clear.useMutation({
    onSuccess:async()=>{
      setMessages({});setChoice({});setNotice(words.clearDone);
      await utils.discoveryCheckpoint.progress.invalidate();
    },
    onError:(err)=>setNotice(err.message||words.error),
  });
  const available=challenges.data?.challenges??[];
  const done=available.filter(x=>progress.data?.some(p=>p.challengeId===x.id&&p.solvedAt)).length;
  return <main className="dc-page" lang={locale==="hi"?"hi":"en"}>
    <div className="dc-shell">
      <a className="dc-back" href="/explorer/adventure"><ArrowLeft size={17}/>{words.back}</a>
      <div className="dc-hero">
        <span className="dc-eyebrow"><ShieldCheck size={17}/>{words.eyebrow}</span>
        <h1>{words.title}</h1><p>{words.intro}</p>
      </div>
      <div className="dc-settings">
        <label>{words.language}<select value={locale} onChange={event=>{setLocale(event.target.value as AdventureLocale);setMessages({})}}><option value="hinglish">Hinglish</option><option value="hi">हिन्दी</option><option value="en">English</option></select></label>
        <label>{words.age}<select value={ageBand} onChange={event=>{setAgeBand(event.target.value as AdventureAgeBand);setChoice({});setMessages({})}}><option value="8-10">8–10</option><option value="11-13">11–13</option><option value="14-17">14–17</option></select></label>
      </div>
      {status.isLoading ? <p role="status">Checking availability…</p> : !enabled ? <div className="dc-locked"><LockKeyhole size={28}/><p>{words.disabled}</p></div> : (
        <>
          {!loading && !isAuthenticated ? <div className="dc-auth"><p>{words.signin}</p><LocalAuthDialog label={words.signin}/></div> : null}
          {isAuthenticated && !adultAcknowledged && <div className="dc-consent">
            <strong>{words.owner}</strong>
            <label><input type="checkbox" checked={adultAcknowledged} onChange={event=>setAdultAcknowledged(event.target.checked)}/><span>{words.consent}</span></label>
            <button type="button" onClick={()=>setAdultAcknowledged(true)}>{words.start}</button>
          </div>}
          {permitted && <>
            <div className="dc-stat"><strong>{words.progress} · {done}/3</strong><span>{done===3?words.complete:words.incomplete}</span></div>
            {challenges.isLoading ? <p role="status">Loading checkpoints…</p> : available.map((q,index)=>{
              const solved=progress.data?.some(p=>p.challengeId===q.id&&p.solvedAt)??false;
              const attempts=progress.data?.find(p=>p.challengeId===q.id)?.attempts??0;
              return <section className="dc-question" key={q.id} aria-labelledby={"dc-"+q.id}>
                <div className="dc-question-heading"><span>{index+1}/3 · {q.world}</span>{solved&&<span className="dc-solved"><CheckCircle2 size={17}/>{words.solved}</span>}</div>
                <h2 id={"dc-"+q.id}>{q.question}</h2>
                <fieldset disabled={solved||submit.isPending||attempts>12}>
                  <legend className="sr-only">{q.question}</legend>
                  {q.options.map(option=><label key={option.id} className={"dc-option"+(choice[q.id]===option.id?" selected":"")}>
                    <input type="radio" name={"dc-"+q.id} value={option.id} checked={choice[q.id]===option.id} onChange={()=>setChoice(previous=>({...previous,[q.id]:option.id}))}/>
                    <span>{option.label}</span>
                  </label>)}
                </fieldset>
                <button type="button" disabled={solved||submit.isPending||!choice[q.id]||attempts>=12}
                  onClick={()=>submit.mutate({ageBand,challengeId:q.id,answerId:choice[q.id],locale,adultAcknowledged:true})}>{solved?words.already:words.submit}</button>
                {messages[q.id]&&<p role="status" className="dc-feedback">{messages[q.id]}</p>}
                {attempts>=12&&!solved&&<p className="dc-note">{words.limit}</p>}
              </section>;
            }) }
            <p className="dc-note"><CircleHelp size={17}/>{words.note}</p>
            <p className="dc-note">{words.warning}</p>
            <button type="button" className="dc-delete" disabled={clear.isPending} onClick={()=>{if(window.confirm(words.confirm))clear.mutate({confirm:"DELETE_MY_CHECKPOINTS"})}}><Trash2 size={17}/>{words.clear}</button>
            {notice&&<p role="status">{notice}</p>}
          </>}
        </>
      )}
      <p className="dc-footnote">{words.disclaimer}</p>
    </div>
  </main>;
}
