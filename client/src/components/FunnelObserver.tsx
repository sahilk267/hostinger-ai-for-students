import { useEffect } from "react";
import { useLocation } from "wouter";
import { trackLearningEvent } from "@/lib/analytics";
import { publicGuides } from "@/data/publicGuides";
import { learningClusters } from "@/data/learningClusters";

/** Public, allowlisted path-level funnel measurement. No query strings or learner attributes. */
const isPublicFunnelPage = (path: string) =>
  path === "/" || path === "/start" || path === "/guides" || path === "/learn" ||
  path === "/parents" || path === "/teachers" || path === "/plans" ||
  path === "/discovery-lab" || path === "/play" || path === "/robotics" ||
  path === "/study" || path === "/topics" ||
  /^\/guides\/[a-z0-9-]+$/.test(path) || /^\/resources\/[a-z0-9-]+$/.test(path);

export default function FunnelObserver() {
  const [location] = useLocation();
  useEffect(() => {
    const path = location.split("?")[0];
    if (isPublicFunnelPage(path)) trackLearningEvent("learning_funnel_page_view", { page: path });
  }, [location]);
  return null;
}
