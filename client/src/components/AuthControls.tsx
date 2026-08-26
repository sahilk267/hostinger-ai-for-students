import { useAuth } from "@/_core/hooks/useAuth";
import LocalAuthDialog from "@/components/LocalAuthDialog";
import { LogOut, UserRound } from "lucide-react";

export default function AuthControls({ onVerified }: { onVerified?: () => void } = {}) {
  const { user, loading, isAuthenticated, logout } = useAuth();
  if (loading) return <span className="auth-status auth-status--loading">Checking account…</span>;
  if (!isAuthenticated) return <LocalAuthDialog label="Save progress" onVerified={onVerified} />;
  return <div className="auth-user"><a href="/account"><UserRound size={14} /> {user?.name || "Learner"}</a><button className="auth-action auth-action--quiet" onClick={() => logout()}><LogOut size={14} /> Log out</button></div>;
}
