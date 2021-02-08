import { generateTVSource } from "../helpers/mod";
import { TRIVIA } from "../types/mod";

const trivia: TRIVIA[] = [{
  question: "Where did episode 1 take place",
  correctAnswer: "On a boat",
  wrongAnswers: ["On a plane", "On a mountain", "On a beach"],
  source: generateTVSource("A TV Show Episode 1"),
}];

export default trivia;
