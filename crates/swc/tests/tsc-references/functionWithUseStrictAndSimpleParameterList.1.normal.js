//// [functionWithUseStrictAndSimpleParameterList.ts]
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!    ,-[1:1]
//!  1 | function a(a = 10) {
//!  2 |     "use strict";
//!    :     ^^^^^^^^^^^^^
//!  3 | }
//!    `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[14:1]
//!  14 | 
//!  15 | function rest(...args: any[]) {
//!  16 |     'use strict';
//!     :     ^^^^^^^^^^^^^
//!  17 | }
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[18:1]
//!  18 | 
//!  19 | function rest1(a = 1, ...args) {
//!  20 |     'use strict';
//!     :     ^^^^^^^^^^^^^
//!  21 | }
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[22:1]
//!  22 | 
//!  23 | function paramDefault(param = 1) {
//!  24 |     'use strict';
//!     :     ^^^^^^^^^^^^^
//!  25 | }
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[26:1]
//!  26 | 
//!  27 | function objectBindingPattern({foo}: any) {
//!  28 |     'use strict';
//!     :     ^^^^^^^^^^^^^
//!  29 | }
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[30:1]
//!  30 | 
//!  31 | function arrayBindingPattern([foo]: any[]) {
//!  32 |     'use strict';
//!     :     ^^^^^^^^^^^^^
//!  33 | }
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[34:1]
//!  34 | 
//!  35 | function manyParameter(a = 10, b = 20) {
//!  36 |     "use strict";
//!     :     ^^^^^^^^^^^^^
//!  37 | }
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[39:1]
//!  39 | function manyPrologue(a = 10, b = 20) {
//!  40 |     "foo";
//!  41 |     "use strict";
//!     :     ^^^^^^^^^^^^^
//!  42 | }
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[45:1]
//!  45 |     "foo";
//!  46 |     const c = 1;
//!  47 |     "use strict";
//!     :     ^^^^^^^^^^^^^
//!  48 | }
//!     `----
