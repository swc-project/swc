//// [/a.ts]
export { };
//// [/b.ts]
export { };
//// [/c.ts]
//!   x the name `A` is defined multiple times
//!    ,-[1:1]
//!  1 | import { A } from "./b";
//!    :          |
//!    :          `-- previous definition of `A` here
//!  2 | const A = 1;
//!    :       |
//!    :       `-- `A` redefined here
//!  3 | export { A };
//!  4 | 
//!    `----
//// [/d.ts]
import { A } from "./c";
A; // Ok
//// [/e.ts]
export var A = 1;
//// [/f.ts]
export * from "./e";
 // Collision error
//// [/g.ts]
import { A } from "./f";
A;
 // Follow-on from collision error
