//// [tsxElementResolution17.tsx]
define([
    "require"
], function(require) {
    "use strict";
});
//// [file.tsx]
define([
    "require"
], function(require) {
    "use strict";
});
//// [consumer.tsx]
//! 
//!   x Expression expected
//!    ,----
//!  5 | <s1.MyElement />;
//!    :               ^
//!    `----
//! 
//!   x Unexpected token `>`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,----
//!  5 | <s1.MyElement />;
//!    :                ^
//!    `----
