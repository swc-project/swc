//// [tsxAttributeResolution9.tsx]
define([
    "require"
], function(require) {
    "use strict";
});
//// [react.d.ts]
define([
    "require"
], function(require) {
    "use strict";
});
//// [file.tsx]
//! 
//!   x Expected '>', got 'foo'
//!    ,----
//!  8 | <MyComponent foo="bar" />; // ok
//!    :              ^^^
//!    `----
