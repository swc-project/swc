//// [tsxElementResolution19.tsx]
define([
    "require"
], function(require) {});
//// [react.d.ts]
define([
    "require"
], function(require) {});
//// [file1.tsx]
define([
    "require",
    "exports",
    "@swc/helpers/src/_class_call_check.mjs"
], function(require, exports, _classCallCheck) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "MyClass", {
        enumerable: !0,
        get: function() {
            return MyClass;
        }
    }), _classCallCheck = _classCallCheck.default;
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
