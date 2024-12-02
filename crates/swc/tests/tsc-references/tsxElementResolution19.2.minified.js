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
    "@swc/helpers/_/_class_call_check"
], function(require, exports, _class_call_check) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "MyClass", {
        enumerable: !0,
        get: function() {
            return MyClass;
        }
    });
    var MyClass = function MyClass() {
        _class_call_check._(this, MyClass);
    };
});
//// [file2.tsx]
define([
    "require",
    "exports",
    "@swc/helpers/_/_interop_require_wildcard",
    "react",
    "./file1"
], function(require, exports, _interop_require_wildcard, _react, _file1) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), _react = /*#__PURE__*/ _interop_require_wildcard._(_react), _file1.MyClass;
});
