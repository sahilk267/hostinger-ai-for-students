import { useState } from "react";
import { ArrowLeft, CheckCircle2, LockKeyhole, Mail } from "lucide-react";
import { trpc } from "@/lib/trpc";
import "./phase14Journey.css";

export default function NewsletterActionPage() {
  const unsubscribe=typeof window!=="undefined" && window.location.pathname.endsWith("/unsubscribe");
  const params=new URLSearchParams(typeof window!=="undefined"?window.location.search:"");
  const key=params.get("key")??"";
  const token=params.get("token")??"";
  const [done,setDone]=useState(false);
  const [invalid,setInvalid]=useState(false);
  const confirm=trpc.newsletter.confirm.useMutation({onSuccess:r=>{setDone(r.confirmed);setInvalid(!r.confirmed);}});
  const remove=trpc.newsletter.unsubscribe.useMutation({onSuccess:r=>{setDone(r.removed);setInvalid(!r.removed);}});
  const valid=/^[a-f0-9]{64}$/.test(key) && (unsubscribe ? /^[a-f0-9]{64}$/.test(token):/^[A-Za-z0-9_-]{36,100}$/.test(token));
  return <div className="phase14-page"><main className="phase14-page-main">
    <a href="/" className="phase14-text-action"><ArrowLeft size={16}/> AI for Students</a>
    <div className="phase14-page-eyebrow"><LockKeyhole size={18}/> ADULT EMAIL SETTINGS</div>
    <h1>{unsubscribe?"Unsubscribe":"Confirm your email"}.</h1>
    <p className="phase14-page-lede">{unsubscribe?"Stop optional adult notes. Your learning account is unaffected.":"Only adults (18+) can opt in. Confirmation does not share child learning data."}</p>
    <section className="phase14-token-card">
      {done?<p className="phase14-notice" role="status"><CheckCircle2 size={19}/>{unsubscribe?"Unsubscribe request processed.":"Email confirmed. Adult subscription recorded. No automated campaigns are sent yet. Your original email includes the unsubscribe link."}</p>
       :!valid||invalid?<p role="alert" className="phase14-notice is-error">This private link is invalid, already used or expired. You may request a new confirmation from the homepage.</p>
       :<><p>Nothing changes until you select the button below.</p>
        <button className="button button--primary" type="button" disabled={confirm.isPending||remove.isPending} onClick={()=>unsubscribe?remove.mutate({key,token}):confirm.mutate({key,token})}><Mail size={16}/>{unsubscribe?"Unsubscribe this email":"Confirm adult subscription"}</button>
        {(confirm.isError||remove.isError)&&<p role="alert" className="phase14-notice is-error">Request failed. Please retry later.</p>}
      </>}
    </section>
    <p className="phase14-trust-note">This URL contains a private token. Do not share or publish it.</p>
  </main></div>;
}
