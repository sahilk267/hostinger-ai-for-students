import { useAuth } from "@/_core/hooks/useAuth";
import LocalAuthDialog from "@/components/LocalAuthDialog";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Check, Download, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function AccountPage() {
  const [, navigate] = useLocation();
  const { isAuthenticated, loading, logout } = useAuth();
  const exportQuery = trpc.learning.export.useQuery(undefined, { enabled: isAuthenticated, retry: 1 });
  const deleteAccount = trpc.learning.deleteAccount.useMutation({
    onSuccess: async () => { toast.success("Your account and saved progress were deleted."); await logout(); navigate("/"); },
    onError: () => toast.error("We could not delete your account. Please try again."),
  });

  const downloadExport = () => {
    if (!exportQuery.data) return;
    const blob = new Blob([JSON.stringify(exportQuery.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "ai-for-students-progress.json";
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Your progress export is ready.");
  };

  if (loading) return <div className="account-page"><p>Checking account…</p></div>;
  if (!isAuthenticated) return <div className="account-page"><a className="game-return" href="/"><ArrowLeft size={15} /> Back to the desk</a><main><span className="game-kicker">ACCOUNT / PRIVATE PROGRESS</span><h1>Save your<br /><em>learning trail.</em></h1><p>Sign in to keep game progress across devices. Guest play remains available without an account.</p><LocalAuthDialog label="Sign in" className="button button--primary" /></main></div>;
  return <div className="account-page"><header><a className="game-return" href="/"><ArrowLeft size={15} /> Back to the desk</a></header><main><span className="game-kicker">ACCOUNT / PRIVATE PROGRESS</span><h1>Your account,<br /><em>your data.</em></h1><p>Download the progress saved to your account, or permanently remove your account and saved learning history.</p>{exportQuery.isLoading && <div className="account-feedback"><RefreshCw size={16} className="spin" /> Loading your saved progress…</div>}{exportQuery.isError && <div className="account-feedback account-feedback--error">We could not load your saved progress. <button className="text-link" onClick={() => exportQuery.refetch()}>Try again</button></div>}{exportQuery.data && exportQuery.data.progress.length === 0 && <div className="account-feedback"><Check size={16} /> Your account has no saved game progress yet.</div>}<p><a href="/guardian" className="text-link">Manage saved Explorer learner profiles and their privacy settings →</a></p><section className="account-actions"><button className="button button--ink" onClick={downloadExport} disabled={!exportQuery.data || exportQuery.isLoading}><Download size={16} /> Download my data</button><button className="account-delete" onClick={() => { if (window.confirm("Delete your account and saved progress? This cannot be undone.")) deleteAccount.mutate(); }} disabled={deleteAccount.isPending}><Trash2 size={16} /> {deleteAccount.isPending ? "Deleting…" : "Delete account"}</button></section>{deleteAccount.isError && <p className="account-inline-error">Deletion failed. Your account is still active; please try again.</p>}</main></div>;
}
