//// [/a.ts]
export { };
//// [/b.ts]
export { B as C } from "./a";
//// [/c.ts]
export { };
//// [/d.ts]
import { D } from "./c";
new D();
