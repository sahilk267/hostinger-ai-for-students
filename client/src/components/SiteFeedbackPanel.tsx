import { useState } from "react";
import { ArrowRight, MessageSquare, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";

type Kind="Suggestion"|"Bug report"|"Parent question";
export default function SiteFeedbackPanel() {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [kind,setKind]=useState<Kind>("Suggestion");
  const [message,setMessage]=useState("");
  const [adult,setAdult]=useState(false);
  const [sent,setSent]=useState(false);
  const request=trpc.contact.submit.useMutation({onSuccess:()=>{setSent(true);setMessage("");}});
  return <section className="phase14-feedback-panel" aria-labelledby="phase14-feedback-heading">
    <div className="phase14-eyebrow"><MessageSquare size={16}/> TELL US WHAT TO IMPROVE</div>
    <h2 id="phase14-feedback-heading">Make the next version better.</h2>
    <p>Adult testers, parents and educators: send a suggestion, broken-button report or parent question. This sends a real email to the team, not a public testimonial.</p>
    {sent?<div role="status" className="phase14-notice">Your message was delivered to the team mailbox. No student practice data was included.</div>
      :<form onSubmit={event=>{event.preventDefault();if(adult&&!request.isPending)request.mutate({name,replyEmail:email,subject:"Product feedback — "+kind,message});}}>
        <div className="phase14-feedback-fields">
          <label>Adult name<input required maxLength={100} autoComplete="name" value={name} onChange={e=>setName(e.target.value)}/></label>
          <label>Reply email<input required type="email" maxLength={320} autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/></label>
          <label>Feedback type<select value={kind} onChange={e=>setKind(e.target.value as Kind)}><option>Suggestion</option><option>Bug report</option><option>Parent question</option></select></label>
          <label className="wide">Message<textarea required minLength={8} maxLength={4000} rows={4} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Which page, what happened, and what should improve? No identifying child details."/></label>
        </div>
        <label className="phase14-check"><input type="checkbox" checked={adult} onChange={e=>setAdult(e.target.checked)} required/> I'm an adult and my message does not contain child names, private answers, passwords or OTP codes.</label>
        <button type="submit" className="button button--primary" disabled={!adult||message.trim().length<8||request.isPending}>{request.isPending?"Sending…":"Send feedback"}<Send size={16}/></button>
        {request.isError&&<p role="alert" className="phase14-notice is-error">Delivery failed. Please retry or use the contact page.</p>}
      </form>}
    <a className="phase14-text-action" href="/contact">Contact page <ArrowRight size={16}/></a>
  </section>;
}
