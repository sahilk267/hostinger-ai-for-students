import { useState } from "react";
import { ArrowRight, MailCheck } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AdultNewsletterSignup() {
  const [email,setEmail]=useState("");
  const [consent,setConsent]=useState(false);
  const [adult,setAdult]=useState(false);
  const [received,setReceived]=useState(false);
  const status=trpc.newsletter.availability.useQuery(undefined,{retry:false});
  const request=trpc.newsletter.request.useMutation({onSuccess:()=>setReceived(true)});
  if(status.isLoading)return <p className="phase14-notice" role="status">Checking email-note availability…</p>;
  if(status.data?.enabled!==true)return <div className="phase14-notice" role="status"><strong>Adult email notes are not accepting subscriptions yet.</strong><p>Nothing was added to a mailing list. You can <a className="phase14-text-action" href="/contact?topic=feedback">send feedback <ArrowRight size={14}/></a> while confirmation and unsubscribe services are prepared.</p></div>;
  if(received)return <div className="phase14-notice" role="status"><MailCheck size={19}/> Request received. If eligible, a private confirmation link will arrive by email. <strong>You are not subscribed until confirming it.</strong></div>;
  return <form className="phase14-newsletter-form" onSubmit={event=>{
    event.preventDefault();if(!adult||!consent||request.isPending)return;
    request.mutate({email,consent:true,adultAcknowledged:true,website:""});
  }}>
    <label htmlFor="newsletter-email">Adult email address (18+)</label>
    <input id="newsletter-email" type="email" required maxLength={320} autoComplete="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
    <label className="phase14-check"><input type="checkbox" required checked={adult} onChange={e=>setAdult(e.target.checked)}/> I'm at least 18. This is a self-declaration, not verified age.</label>
    <label className="phase14-check"><input type="checkbox" required checked={consent} onChange={e=>setConsent(e.target.checked)}/> I request optional adult AI learning notes, will verify my email, and can unsubscribe through the private email link.</label>
    <button type="submit" className="button button--ink" disabled={!adult||!consent||request.isPending}>{request.isPending?"Requesting…":"Send confirmation email"}<ArrowRight size={16}/></button>
    {request.isError&&<p role="alert" className="phase14-notice is-error">Confirmation request failed. Please retry later.</p>}
    <small>No child profiles, DOB, private answers or practice records are collected. No automated newsletters are sent before consent.</small>
  </form>;
}
