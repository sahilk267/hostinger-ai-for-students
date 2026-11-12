/** Pure scoring rule for the robot route activity.
 * A correct plan can earn one point per round, even after repeated checks.
 */
export function assessRobotRoute(
  order: readonly string[],
  target: readonly string[],
  previousScore: number,
  alreadySolved: boolean
): { checked: boolean; correct: boolean; solved: boolean; score: number } {
  if (order.length !== target.length || alreadySolved) {
    return { checked: false, correct: alreadySolved, solved: alreadySolved, score: previousScore };
  }
  const correct = order.every((step, index) => step === target[index]);
  return {
    checked: true,
    correct,
    solved: correct,
    score: previousScore + (correct ? 1 : 0),
  };
}
