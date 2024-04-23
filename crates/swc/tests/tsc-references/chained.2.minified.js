//// [/a.ts]
import "@swc/helpers/_/_class_call_check";
//// [/b.ts]
export { B as C } from './a';
//// [/c.ts]
export { };
//// [/d.ts]
import { D } from './c';
new D();
