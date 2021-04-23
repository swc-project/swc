import { TRIVIA } from "types";
import { getUserInput, printQuestion } from "./mod.ts";

export async function askTriviaQuestion(
  selectedTrivia: TRIVIA,
): Promise<void> {
  printQuestion(selectedTrivia.question);

  await getUserInput();

  console.log("The correct answer is:", selectedTrivia.correctAnswer);

  console.log("Source:", selectedTrivia.source.name, "\n");
}
