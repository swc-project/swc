//// [a.ts]
export { };
//// [b.ts]
//!   x the name `A` is defined multiple times
//!    ,-[1:1]
//!  1 | import { A } from "./a";
//!    :          |
//!    :          `-- previous definition of `A` here
//!  2 | const A = 0;
//!    :       |
//!    :       `-- `A` redefined here
//!  3 | export { A };
//!  4 | 
//!    `----
//// [c.ts]
import { A } from "./b";
