import type { TopicTrack, CurriculumTopic } from "@/data/curriculumTopics";
export type TopicResource = { label: string; href: string; practiceLabel: string; practiceHref: string; disclosure: string };

const trackResources: Record<TopicTrack, TopicResource> = {
  foundations:{label:"Read AI beginner guide",href:"/guides/ai-tools-for-beginners",practiceLabel:"Try prompt examples",practiceHref:"/play",disclosure:"General background, not a dedicated lesson for this topic"},
  study:{label:"Read study skills guide",href:"/guides/how-to-use-ai-for-studying",practiceLabel:"Explore study workflows",practiceHref:"/study",disclosure:"Related study resource; topic-specific instruction may be limited"},
  research:{label:"Read source-checking guide",href:"/guides/how-to-check-ai-answers",practiceLabel:"Practise fact-checking",practiceHref:"/play?game=fact",disclosure:"Related evidence resource, not a full individual topic lesson"},
  career:{label:"Read beginner AI guide",href:"/guides/ai-tools-for-beginners",practiceLabel:"Try prompt practice",practiceHref:"/play",disclosure:"Related foundational resource; a dedicated career lesson is not available yet"},
  creation:{label:"Read prompt-writing guide",href:"/guides/ai-prompts-for-students",practiceLabel:"Try a creative exercise",practiceHref:"/play?game=creative-director",disclosure:"Related creative resource; not a dedicated lesson for each topic"},
  coding:{label:"Read prompt-writing guide",href:"/guides/ai-prompts-for-students",practiceLabel:"Explore code-coach game",practiceHref:"/play?game=code-coach",disclosure:"General AI guidance, not a technical coding tutorial"},
  safety:{label:"Read family AI safety guide",href:"/guides/ai-safety-for-kids-and-parents",practiceLabel:"Practise safer AI choices",practiceHref:"/play?game=safety",disclosure:"Related safety guide, not a dedicated lesson for every policy topic"},
  everyday:{label:"Read beginner AI guide",href:"/guides/ai-tools-for-beginners",practiceLabel:"Try safer AI choices",practiceHref:"/play?game=safety",disclosure:"Related introductory resource, not complete coverage of this exact topic"},
};
export function getTopicResource(topic: CurriculumTopic): TopicResource {
  if (topic.title === "Study-plan design" || topic.title === "Spaced revision") return {label:"Build an exam study plan",href:"/guides/ai-study-plan-for-exams",practiceLabel:"Explore study workflows",practiceHref:"/study",disclosure:"Relevant practical study guide"};
  if (topic.title === "Prompts and instructions" || topic.title === "Prompt debugging") return {label:"Learn prompt techniques",href:"/guides/ai-prompts-for-students",practiceLabel:"Try prompt workshop",practiceHref:"/play?game=workshop",disclosure:"Relevant prompt-learning guide"};
  return trackResources[topic.track];
}
