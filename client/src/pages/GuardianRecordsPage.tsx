import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ClipboardCheck, LockKeyhole, RefreshCw, ShieldAlert, Trash2, Users } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import LocalAuthDialog from "@/components/LocalAuthDialog";
import "./guardianRecords.css";

/**
 * Private adult-account overview. The account may not belong to a verified
 * parent; OTP sign-in and self-attestation are NOT legal guardian verification.
 */
export default function GuardianRecordsPage() {
  const { isAuthenticated, loading } = useAuth();
  const [feedback, setFeedback] = useState("");
  const profiles = trpc.explorer.profiles.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const attempts = trpc.explorer.attempts.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const utils = trpc.useUtils();
  const remove = trpc.explorer.deleteProfile.useMutation({
    onSuccess: async () => {
      setFeedback("Profile and associated saved evidence were deleted from this account.");
      await Promise.all([utils.explorer.profiles.invalidate(), utils.explorer.attempts.invalidate()]);
    },
    onError: () => setFeedback("Unable to delete this profile. Please try again."),
  });

  const recordsByProfile = useMemo(() => {
    const map = new Map<number, { entries: number; missions: Set<string> }>();
    for (const attempt of attempts.data ?? []) {
      const value = map.get(attempt.profileId) ?? { entries: 0, missions: new Set<string>() };
      value.entries++;
      value.missions.add(attempt.missionId);
      map.set(attempt.profileId, value);
    }
    return map;
  }, [attempts.data]);

  const deleteProfile = (id: number, nickname: string) => {
    if (!window.confirm(
      "Permanently delete '" + nickname + "' and its saved mission attempts and share links? This cannot be undone."
    )) return;
    setFeedback("");
    remove.mutate({ profileId: id });
  };

  return <main className="guardian-records">
    <div className="gr-container">
      <a href="/account" className="gr-back"><ArrowLeft size={17} /> Back to my account</a>
      <header className="gr-header">
        <span className="gr-eyebrow"><LockKeyhole size={17} /> PRIVATE ACCOUNT · LEARNING RECORDS</span>
        <h1>Manage learner practice records.</h1>
        <p>Review which Explorer profiles are saved under this account, and remove their recorded attempts whenever needed.</p>
      </header>

      {loading ? <p role="status" className="gr-notice">Checking your account…</p> : !isAuthenticated ? (
        <section className="gr-panel">
          <ShieldAlert size={27} />
          <h2>Sign in to view private records</h2>
          <p>This page does not expose any learner profile without account authentication. Guest practice is available separately.</p>
          <LocalAuthDialog label="Sign in to this account" className="gr-signin" />
        </section>
      ) : <>
        <section className="gr-disclaimer">
          <ShieldAlert size={24} />
          <p><strong>Important privacy boundary.</strong> Email-login verifies access to an email account, not adulthood or legal guardianship. Any guardian consent stored for Explorer profiles is a self-declaration and must not be described as independently verified. Avoid real names or sensitive details.</p>
        </section>

        {profiles.isLoading || attempts.isLoading ? <p role="status" className="gr-notice"><RefreshCw size={17} /> Loading account records…</p> : null}
        {profiles.isError || attempts.isError ? <div role="alert" className="gr-error">
          We could not load all records. Try again before making changes.
          <button type="button" onClick={() => { void profiles.refetch(); void attempts.refetch(); }}>Retry loading</button>
        </div> : null}

        {!profiles.isError && !attempts.isError && !profiles.isLoading && !attempts.isLoading && <>
          <div className="gr-section-title"><h2><Users size={22} /> Saved Explorer profiles</h2><span>{profiles.data?.length ?? 0} of 5 allowed per account</span></div>
          {(profiles.data?.length ?? 0) === 0 ? (
            <section className="gr-empty">
              <ClipboardCheck size={35} />
              <h3>No saved learner profiles</h3>
              <p>Families can use the free browser-only adventure without creating a profile. For optional account saving, start in Explorer.</p>
              <a href="/explorer">Open Explorer <ArrowRight size={16} /></a>
            </section>
          ) : <div className="gr-grid">
            {profiles.data?.map(profile => {
              const summary = recordsByProfile.get(profile.id);
              return <article key={profile.id} className="gr-card">
                <div className="gr-card-head"><span className="gr-avatar" aria-hidden="true">✦</span><div><h3>{profile.displayName}</h3><span>Age band {profile.ageBand}</span></div></div>
                <div className="gr-record-stats">
                  <div><strong>{summary?.missions.size ?? 0}</strong><span>Different missions attempted</span></div>
                  <div><strong>{summary?.entries ?? 0}</strong><span>Saved attempt records</span></div>
                </div>
                <p className="gr-consent">Recorded acknowledgement: {profile.consentAt ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(profile.consentAt)) : "Not available"}. Self-attested, not guardian-verified.</p>
                <button type="button" className="gr-delete" disabled={remove.isPending} onClick={() => deleteProfile(profile.id, profile.displayName)}>
                  <Trash2 size={17} /> Permanently delete this profile
                </button>
              </article>;
            })}
          </div>}
          <div className="gr-next">
            <p><strong>Need a fresh practice activity?</strong> Results represent submitted work, not a ranking or prediction of a child's abilities.</p>
            <a href="/explorer">Explore free missions <ArrowRight size={17}/></a>
          </div>
        </>}
        {feedback && <p role="status" className="gr-notice">{feedback}</p>}
      </>}
      <footer className="gr-footer">AI for Students · Privacy-first learning practice · No career prediction or aptitude certificate</footer>
    </div>
  </main>;
}
