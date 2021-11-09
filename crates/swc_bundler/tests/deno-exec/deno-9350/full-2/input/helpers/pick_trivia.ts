import { TRIVIA } from "types";
import { ALL_TRIVIA } from "../trivia/mod.ts";

export function getFirstTrivia(
  providedTrivia: TRIVIA[] = ALL_TRIVIA,
): TRIVIA {
  return providedTrivia[0];
}
