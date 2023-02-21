//// [/a.ts]
import "@swc/helpers/src/_class_call_check.mjs";
//// [/b.ts]
export { B as C } from "./a";
//// [/c.ts]
export { };
//// [/d.ts]
import { D } from "./c";
new D();
