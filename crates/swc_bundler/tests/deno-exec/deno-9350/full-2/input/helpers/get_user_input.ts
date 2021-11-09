import { readLines } from "https://deno.land/std@0.89.0/io/mod.ts";
import { printQuestion } from "./mod.ts";

export const getNumericInput = (): Promise<number> => Promise.resolve(4);

export async function getUserInput(): Promise<string> {
  printQuestion("What would you like to enter");

  const reader = readLines(Deno.stdin);

  return (await reader.next()).value;
}
