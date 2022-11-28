//// [functionWithUseStrictAndSimpleParameterList_es2016.ts]
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!    ,-[1:1]
//!  1 | 
//!  2 | function a(a = 10) {
//!  3 |     "use strict";
//!    :     ^^^^^^^^^^^^^
//!  4 | }
//!    `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[15:1]
//!  15 | 
//!  16 | function rest(...args: any[]) {
//!  17 |     'use strict';
//!     :     ^^^^^^^^^^^^^
//!  18 | }
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[19:1]
//!  19 | 
//!  20 | function rest1(a = 1, ...args) {
//!  21 |     'use strict';
//!     :     ^^^^^^^^^^^^^
//!  22 | }
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[23:1]
//!  23 | 
//!  24 | function paramDefault(param = 1) {
//!  25 |     'use strict';
//!     :     ^^^^^^^^^^^^^
//!  26 | }
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[27:1]
//!  27 | 
//!  28 | function objectBindingPattern({foo}: any) {
//!  29 |     'use strict';
//!     :     ^^^^^^^^^^^^^
//!  30 | }
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[31:1]
//!  31 | 
//!  32 | function arrayBindingPattern([foo]: any[]) {
//!  33 |     'use strict';
//!     :     ^^^^^^^^^^^^^
//!  34 | }
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[35:1]
//!  35 | 
//!  36 | function manyParameter(a = 10, b = 20) {
//!  37 |     "use strict";
//!     :     ^^^^^^^^^^^^^
//!  38 | }
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[40:1]
//!  40 | function manyPrologue(a = 10, b = 20) {
//!  41 |     "foo";
//!  42 |     "use strict";
//!     :     ^^^^^^^^^^^^^
//!  43 | }
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[46:1]
//!  46 |     "foo";
//!  47 |     const c = 1;
//!  48 |     "use strict";
//!     :     ^^^^^^^^^^^^^
//!  49 | }
//!     `----
