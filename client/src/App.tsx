/* Study Desk Editorial: global app shell keeps the warm editorial brand consistent across routes. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import GamePage from "./pages/GamePage";
import ProgressPage from "./pages/ProgressPage";
import CertificatePage from "./pages/CertificatePage";
import NotFound from "./pages/NotFound";
import AccountPage from "./pages/AccountPage";
import TopicsPage from "./pages/TopicsPage";
import LearnPage from "./pages/LearnPage";
import StudyPage from "./pages/StudyPage";
import RoboticsPage from "./pages/RoboticsPage";
import ContactPage from "./pages/ContactPage";
import MissionPage from "./pages/MissionPage";
import JourneyPage from "./pages/JourneyPage";
import ExplorerPage from "./pages/ExplorerPage";
import ExplorerReportPage from "./pages/ExplorerReportPage";
import ExplorerSharePage from "./pages/ExplorerSharePage";
import PilotReviewPage from "./pages/PilotReviewPage";
import DiscoveryLabPage from "./pages/DiscoveryLabPage";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/play" component={GamePage} />
      <Route path="/mission" component={MissionPage} />
      <Route path="/journey" component={JourneyPage} />
      <Route path="/explorer" component={ExplorerPage} />
      <Route path="/explorer/report" component={ExplorerReportPage} />
      <Route path="/explorer/share/:token" component={ExplorerSharePage} />
      <Route path="/explorer/pilot-review" component={PilotReviewPage} />
      <Route path="/progress" component={ProgressPage} />
      <Route path="/certificate" component={CertificatePage} />
      <Route path="/account" component={AccountPage} />
      <Route path="/topics" component={TopicsPage} />
      <Route path="/learn" component={LearnPage} />
      <Route path="/study" component={StudyPage} />
      <Route path="/robotics" component={RoboticsPage} />
      <Route path="/discovery-lab" component={DiscoveryLabPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="bottom-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
