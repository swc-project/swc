//!
//!  x the name `foo` is defined multiple times
//!   ,-[4:1]
//! 4 | export function foo() { }
//!   :                 ^|^
//!   :                  `-- previous definition of `foo` here
//! 5 | 
//! 6 | //@filename: bar.ts
//! 7 | import { foo } from './foo';
//!   :          ^|^
//!   :           `-- `foo` redefined here
//!   `----
