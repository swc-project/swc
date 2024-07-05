//// [/z.ts]
export { };
//// [/a.ts]
//!   x the name `A` is defined multiple times
//!    ,-[1:1]
//!  1 | import { A } from './z';
//!    :          |
//!    :          `-- previous definition of `A` here
//!  2 | const A = 0;
//!    :       |
//!    :       `-- `A` redefined here
//!  3 | export { A };
//!  4 | export class B {};
//!    `----
//// [/b.ts]
var t = {
    A: undefined,
    B: undefined
};
export { };
