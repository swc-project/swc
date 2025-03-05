//// [tsxElementResolution17.tsx]
define([
    "require"
], function(require) {});
//// [file.tsx]
//!   x the name `MyElement` is defined multiple times
//!     ,-[7:1]
//!   4 | }
//!   5 | 
//!   6 | declare module 'elements1' {
//!   7 |     class MyElement {
//!     :           ^^^^|^^^^
//!     :               `-- previous definition of `MyElement` here
//!   8 | 
//!   9 |     }
//!  10 | }
//!  11 | 
//!  12 | declare module 'elements2' {
//!  13 |     class MyElement {
//!     :           ^^^^|^^^^
//!     :               `-- `MyElement` redefined here
//!  14 | 
//!  15 |     }
//!  16 | }
//!     `----
//// [consumer.tsx]
define([
    "require",
    "exports",
    "elements1"
], function(require, exports, _elements1) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), _elements1.MyElement;
});
