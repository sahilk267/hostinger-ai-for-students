import { describe, expect, it } from "vitest";
import { classroomCollections, formatClassroomCollection } from "./classroomCollections";
import { publicGuides } from "./publicGuides";
import { learningClusters } from "./learningClusters";

describe("downloadable teacher collection integrity", () => {
  it("provides ten linked, actionable sessions with a unique collection ID", () => {
    expect(new Set(classroomCollections.map(collection=>collection.id)).size).toBe(classroomCollections.length);
    expect(classroomCollections.reduce((sum,collection)=>sum+collection.sessions.length,0)).toBe(10);
    for (const collection of classroomCollections) {
      const output=formatClassroomCollection(collection);
      expect(output).toContain(collection.title);
      for (const session of collection.sessions) {
        expect(session.goal.length).toBeGreaterThan(15);
        expect(session.reflect.length).toBeGreaterThan(12);
        expect(output).toContain(session.title);
        expect(output).toContain(session.goal);
        expect(output).toContain(session.reflect);
        expect(output).toContain(session.href);
      }
      expect(output).toContain("Do not collect or upload student identifiers");
      expect(output).toContain("not validated diagnostic assessment");
    }
  });

  it("references only real public routes and published guide slugs", () => {
    const guides = new Set(publicGuides.map(guide=>"/guides/"+guide.slug));
    const clusters = new Set(learningClusters.map(cluster=>"/resources/"+cluster.slug));
    for (const collection of classroomCollections) {
      for (const session of collection.sessions) {
        const url = new URL(session.href,"https://example.test");
        expect(url.origin).toBe("https://example.test");
        if (url.pathname.startsWith("/guides/")) expect(guides.has(url.pathname)).toBe(true);
        if (url.pathname.startsWith("/resources/")) expect(clusters.has(url.pathname)).toBe(true);
      }
    }
  });
});
