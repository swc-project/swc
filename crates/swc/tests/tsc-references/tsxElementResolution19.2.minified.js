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
define([
    "require",
    "exports",
    "@swc/helpers/src/_interop_require_wildcard.mjs",
    "react",
    "./file1"
], function(require, exports, _interopRequireWildcard, _react, _file1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), _react = (_interopRequireWildcard = _interopRequireWildcard.default)(_react), _file1.MyClass;
});
