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
], function(require, exports, _class_call_check) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "MyClass", {
        enumerable: !0,
        get: function() {
            return MyClass;
        }
    }), _class_call_check = _class_call_check.default;
    var MyClass = function MyClass() {
        "use strict";
        _class_call_check(this, MyClass);
    };
});
//// [file2.tsx]
define([
    "require",
    "exports",
    "@swc/helpers/src/_interop_require_wildcard.mjs",
    "react",
    "./file1"
], function(require, exports, _interop_require_wildcard, _react, _file_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), _react = (_interop_require_wildcard = _interop_require_wildcard.default)(_react), _file_1.MyClass;
});
