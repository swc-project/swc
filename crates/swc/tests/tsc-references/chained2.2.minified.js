//// [/a.ts]
export { };
//// [/b.ts]
import A from "./a";
export { A };
//// [/c.ts]
import * as types from "./b";
export { types as default };
//// [/d.ts]
import types from "./c";
new types.A(), new types.B();
