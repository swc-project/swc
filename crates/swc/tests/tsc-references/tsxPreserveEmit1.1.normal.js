//// [tsxPreserveEmit1.tsx]
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
//// [test.tsx]
//! 
//!   x Expression expected
//!    ,----
//!  7 | var routes1 = <Route />;
//!    :                      ^
//!    `----
//! 
//!   x Unexpected token `>`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,----
//!  7 | var routes1 = <Route />;
//!    :                       ^
//!    `----
