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
import "./c";
//// [/e.ts]
export var A = 1;
//// [/f.ts]
export * from "./e";
//// [/g.ts]
import "./f";
