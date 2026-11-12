import { describe, expect, it } from "vitest";
import { assessRobotRoute } from "./roboticsScoring";
import { curriculumTopics } from "@/data/curriculumTopics";
import { getTopicResource } from "./topicResources";
import { getGameFollowUp } from "./gameFollowUps";
import { guideExercises } from "@/data/guideExercises";
import { publicGuides } from "@/data/publicGuides";
import { classroomCollections } from "@/data/classroomCollections";
import type { GameId } from "./learningProgress";

const gameIds: GameId[] = [
  "prompt-detective","fact-check-quest","ai-safety-lab","prompt-workshop","source-hunt",
  "bias-buster","ai-decoder","data-detective","creative-director","code-coach",
  "decision-studio","tool-match","robotics","pattern-builder","memory-adventure",
  "mini-scientist","bridge-builder","robot-programmer","traffic-controller",
  "mission-commander","creative-studio","performance-arena",
];

describe("robot route scoring", () => {
  const target = ["goal", "sensor", "rule", "action"];

  it("does not award points before all blocks are selected", () => {
    expect(assessRobotRoute(["goal"], target, 2, false)).toEqual({
      checked:false,correct:false,solved:false,score:2
    });
  });

  it("allows corrections without awarding points for wrong plans", () => {
    const wrong = assessRobotRoute(["sensor","goal","rule","action"],target,2,false);
    expect(wrong).toEqual({checked:true,correct:false,solved:false,score:2});
    const corrected = assessRobotRoute(target,target,wrong.score,wrong.solved);
    expect(corrected).toEqual({checked:true,correct:true,solved:true,score:3});
  });

  it("never scores an already solved round twice", () => {
    const first = assessRobotRoute(target,target,7,false);
    const again = assessRobotRoute(target,target,first.score,first.solved);
    expect(first.score).toBe(8);
    expect(again).toEqual({checked:false,correct:true,solved:true,score:8});
  });
});

describe("ecosystem content integrity", () => {
  it("assigns every curriculum topic a local guide and a local practice link", () => {
    expect(curriculumTopics).toHaveLength(120);
    for (const topic of curriculumTopics) {
      const resource = getTopicResource(topic);
      expect(resource.href).toMatch(/^\//);
      expect(resource.practiceHref).toMatch(/^\//);
      expect(resource.disclosure.length).toBeGreaterThan(5);
    }
  });

  it("provides a non-empty follow-up for every game ID", () => {
    expect(gameIds).toHaveLength(22);
    for (const id of gameIds) {
      const next = getGameFollowUp(id);
      expect(next.title).toBeTruthy();
      expect(next.href).toMatch(/^\//);
      expect(next.prompt.length).toBeGreaterThan(15);
    }
  });

  it("provides at least one actual worked exercise per published guide", () => {
    for (const guide of publicGuides) {
      expect(guideExercises[guide.slug]?.length).toBeGreaterThan(0);
      for (const exercise of guideExercises[guide.slug]) {
        expect(exercise.task.length).toBeGreaterThan(20);
        expect(exercise.check.length).toBeGreaterThan(20);
      }
    }
  });

  it("offers original linked activities in each educator collection", () => {
    expect(classroomCollections.length).toBeGreaterThanOrEqual(3);
    for (const collection of classroomCollections) {
      expect(collection.sessions.length).toBeGreaterThan(1);
      for (const session of collection.sessions) {
        expect(session.href).toMatch(/^\//);
        expect(session.goal).toBeTruthy();
        expect(session.reflect).toBeTruthy();
      }
    }
  });
});
