//// [tsxPreserveEmit2.tsx]
define([
    "require"
], function(require) {});
//// [test.tsx]
//! 
//!   x Expression expected
//!    ,----
//!  3 | var routes1 = <Route />;
//!    :                      ^
//!    `----
//! 
//!   x Unexpected token `>`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,----
//!  3 | var routes1 = <Route />;
//!    :                       ^
//!    `----
