//// [tsxElementResolution19.tsx]
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
//// [file1.tsx]
define([
    "require",
    "exports",
    "@swc/helpers/src/_class_call_check.mjs"
], function(require, exports, _classCallCheck) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "MyClass", {
        enumerable: true,
        get: function() {
            return MyClass;
        }
    });
    _classCallCheck = _classCallCheck.default;
    var MyClass = function MyClass() {
        "use strict";
        _classCallCheck(this, MyClass);
    };
});
//// [file2.tsx]
//! 
//!   x Expression expected
//!    ,----
//!  6 | <MyClass />;
//!    :          ^
//!    `----
//! 
//!   x Unexpected token `>`. Expected this, import, async, function, [ for array literal, { for object literal, @ for decorator, function, class, null, true, false, number, bigint, string, regexp, `
//!   | for template literal, (, or an identifier
//!    ,----
//!  6 | <MyClass />;
//!    :           ^
//!    `----
