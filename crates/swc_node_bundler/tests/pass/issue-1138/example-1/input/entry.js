import { a as defaultA } from "./l.ts";

const o: { a?: string } = {};

const { a = defaultA } = o;

console.log(a);
