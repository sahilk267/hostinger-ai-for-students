import { trpc } from "@/lib/trpc";
import { startLogin } from "@/const";
import { useState } from "react";
import { Mail, X } from "lucide-react";
import { toast } from "sonner";

export default function LocalAuthDialog({
  label = "Sign in to save progress",
  className = "auth-action",
  onVerified,
}: {
  label?: string;
  className?: string;
  onVerified?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const utils = trpc.useUtils();
  const requestCode = trpc.auth.requestEmailCode.useMutation({
    onSuccess: () => {
      setSent(true);
      toast.success("Your verification code is on its way.");
    },
    onError: (error) => toast.error(error.message || "We could not send a code."),
  });
  const verifyCode = trpc.auth.verifyEmailCode.useMutation({
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error("That code is incorrect or has expired.");
        return;
      }
      await utils.auth.me.invalidate();
      setOpen(false);
      setSent(false);
      setCode("");
      toast.success("You are signed in. Your progress is now saved.");
      onVerified?.();
    },
    onError: (error) => toast.error(error.message || "We could not verify that code."),
  });

  const close = () => {
    if (requestCode.isPending || verifyCode.isPending) return;
    setOpen(false);
    setSent(false);
    setCode("");
  };

  return (
    <>
      <button className={className} onClick={() => setOpen(true)} type="button">
        <Mail size={14} /> {label}
      </button>
      {open && (
        <div className="auth-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="local-auth-title">
            <button className="auth-modal-close" type="button" onClick={close} aria-label="Close sign-in dialog"><X size={17} /></button>
            <span className="game-kicker">PRIVATE PROGRESS / EMAIL SIGN-IN</span>
            <h2 id="local-auth-title">Keep your learning trail.</h2>
            <p>We will send a six-digit code from <strong>auth@aiforstudents.in</strong>. Guest play remains available if you close this window.</p>
            <label htmlFor="local-auth-email">Email address</label>
            <input id="local-auth-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" disabled={sent || requestCode.isPending} />
            {!sent ? (
              <button className="button button--primary" type="button" onClick={() => requestCode.mutate({ email })} disabled={requestCode.isPending || !email.includes("@")}>
                {requestCode.isPending ? "Sending code…" : "Send verification code"}
              </button>
            ) : (
              <>
                <label htmlFor="local-auth-code">Six-digit code</label>
                <input id="local-auth-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="123456" />
                <button className="button button--primary" type="button" onClick={() => verifyCode.mutate({ email, code })} disabled={verifyCode.isPending || code.length !== 6}>
                  {verifyCode.isPending ? "Checking code…" : "Verify and sign in"}
                </button>
                <button className="text-link" type="button" onClick={() => { setSent(false); setCode(""); }}>Use a different email</button>
              </>
            )}
            <div className="auth-modal-divider"><span>or</span></div>
            <button className="text-link" type="button" onClick={() => startLogin()}>Continue with Manus OAuth</button>
          </section>
        </div>
      )}
    </>
  );
}
