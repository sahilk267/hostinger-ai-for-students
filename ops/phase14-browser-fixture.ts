/**
 * Test-only authored IDs for isolated browser acceptance. Never includes
 * a child identity, personal answers or production-origin data.
 */
import { getAgeAdventureMissions } from "../client/src/data/discoveryAdventure";
import { getTransferChallenges } from "../client/src/data/discoveryTransfer";

const missions=getAgeAdventureMissions("11-13").map(mission=>mission.id);
const transfers=getTransferChallenges("11-13").map(challenge=>challenge.id);
if(missions.length!==9 || transfers.length!==3) {
  throw new Error("The selected learning group must have nine missions and three challenges");
}
console.log(JSON.stringify({missions,transfers}));