import { type TypeA, type TypeB, valueA, valueB } from "lib-a";
import { type TypeC, valueC } from "lib-b";
import type { TypeOnly } from "lib-c";

type Local = TypeA | TypeB | TypeC | TypeOnly;

export type Public = Local;

const sum = valueA + valueB + valueC;

export { valueA, valueC, sum };
