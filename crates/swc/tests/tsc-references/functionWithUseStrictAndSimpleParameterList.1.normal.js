//// [functionWithUseStrictAndSimpleParameterList.ts]
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!    ,-[1:1]
//!  1 | function a(a = 10) {
//!  2 |     "use strict";
//!    :     ^^^^^^^^^^^^^
//!  3 | }
//!  4 | 
//!  5 | export var foo = 10;
//!    `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[13:1]
//!  13 | }
//!  14 | 
//!  15 | function rest(...args: any[]) {
//!  16 |     'use strict';
//!     :     ^^^^^^^^^^^^^
//!  17 | }
//!  18 | 
//!  19 | function rest1(a = 1, ...args) {
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[17:1]
//!  17 | }
//!  18 | 
//!  19 | function rest1(a = 1, ...args) {
//!  20 |     'use strict';
//!     :     ^^^^^^^^^^^^^
//!  21 | }
//!  22 | 
//!  23 | function paramDefault(param = 1) {
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[21:1]
//!  21 | }
//!  22 | 
//!  23 | function paramDefault(param = 1) {
//!  24 |     'use strict';
//!     :     ^^^^^^^^^^^^^
//!  25 | }
//!  26 | 
//!  27 | function objectBindingPattern({foo}: any) {
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[25:1]
//!  25 | }
//!  26 | 
//!  27 | function objectBindingPattern({foo}: any) {
//!  28 |     'use strict';
//!     :     ^^^^^^^^^^^^^
//!  29 | }
//!  30 | 
//!  31 | function arrayBindingPattern([foo]: any[]) {
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[29:1]
//!  29 | }
//!  30 | 
//!  31 | function arrayBindingPattern([foo]: any[]) {
//!  32 |     'use strict';
//!     :     ^^^^^^^^^^^^^
//!  33 | }
//!  34 | 
//!  35 | function manyParameter(a = 10, b = 20) {
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[33:1]
//!  33 | }
//!  34 | 
//!  35 | function manyParameter(a = 10, b = 20) {
//!  36 |     "use strict";
//!     :     ^^^^^^^^^^^^^
//!  37 | }
//!  38 | 
//!  39 | function manyPrologue(a = 10, b = 20) {
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[38:1]
//!  38 | 
//!  39 | function manyPrologue(a = 10, b = 20) {
//!  40 |     "foo";
//!  41 |     "use strict";
//!     :     ^^^^^^^^^^^^^
//!  42 | }
//!  43 | 
//!  44 | function invalidPrologue(a = 10, b = 20) {
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[44:1]
//!  44 | function invalidPrologue(a = 10, b = 20) {
//!  45 |     "foo";
//!  46 |     const c = 1;
//!  47 |     "use strict";
//!     :     ^^^^^^^^^^^^^
//!  48 | }
//!     `----
