import { TRIVIA } from "../types/mod";
import { getUserInput, printQuestion } from "./mod";

export async function askTriviaQuestion(
  selectedTrivia: TRIVIA,
): Promise<void> {
  printQuestion(selectedTrivia.question);

  await getUserInput();

  console.log("The correct answer is:", selectedTrivia.correctAnswer);

  console.log("Source:", selectedTrivia.source.name, "\n");
}
