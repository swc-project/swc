//// [functionWithUseStrictAndSimpleParameterList_es2016.ts]
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!    ,-[2:1]
//!  2 | function a(a = 10) {
//!  3 |     "use strict";
//!    :     ^^^^^^^^^^^^^
//!  4 | }
//!  5 | 
//!  6 | export var foo = 10;
//!    `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[14:1]
//!  14 | }
//!  15 | 
//!  16 | function rest(...args: any[]) {
//!  17 |     'use strict';
//!     :     ^^^^^^^^^^^^^
//!  18 | }
//!  19 | 
//!  20 | function rest1(a = 1, ...args) {
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[18:1]
//!  18 | }
//!  19 | 
//!  20 | function rest1(a = 1, ...args) {
//!  21 |     'use strict';
//!     :     ^^^^^^^^^^^^^
//!  22 | }
//!  23 | 
//!  24 | function paramDefault(param = 1) {
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[22:1]
//!  22 | }
//!  23 | 
//!  24 | function paramDefault(param = 1) {
//!  25 |     'use strict';
//!     :     ^^^^^^^^^^^^^
//!  26 | }
//!  27 | 
//!  28 | function objectBindingPattern({foo}: any) {
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[26:1]
//!  26 | }
//!  27 | 
//!  28 | function objectBindingPattern({foo}: any) {
//!  29 |     'use strict';
//!     :     ^^^^^^^^^^^^^
//!  30 | }
//!  31 | 
//!  32 | function arrayBindingPattern([foo]: any[]) {
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[30:1]
//!  30 | }
//!  31 | 
//!  32 | function arrayBindingPattern([foo]: any[]) {
//!  33 |     'use strict';
//!     :     ^^^^^^^^^^^^^
//!  34 | }
//!  35 | 
//!  36 | function manyParameter(a = 10, b = 20) {
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[34:1]
//!  34 | }
//!  35 | 
//!  36 | function manyParameter(a = 10, b = 20) {
//!  37 |     "use strict";
//!     :     ^^^^^^^^^^^^^
//!  38 | }
//!  39 | 
//!  40 | function manyPrologue(a = 10, b = 20) {
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[40:1]
//!  40 | function manyPrologue(a = 10, b = 20) {
//!  41 |     "foo";
//!  42 |     "use strict";
//!     :     ^^^^^^^^^^^^^
//!  43 | }
//!  44 | 
//!  45 | function invalidPrologue(a = 10, b = 20) {
//!     `----
//! 
//!   x Illegal 'use strict' directive in function with non-simple parameter list.
//!     ,-[45:1]
//!  45 | function invalidPrologue(a = 10, b = 20) {
//!  46 |     "foo";
//!  47 |     const c = 1;
//!  48 |     "use strict";
//!     :     ^^^^^^^^^^^^^
//!  49 | }
//!     `----
