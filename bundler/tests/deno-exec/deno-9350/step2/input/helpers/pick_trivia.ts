import { TRIVIA } from "../types/mod";
import { ALL_TRIVIA } from "../trivia/mod";

export function getFirstTrivia(
  providedTrivia: TRIVIA[] = ALL_TRIVIA,
): TRIVIA {
  return providedTrivia[0];
}
