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
], function(require, exports, _class_call_check) {
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
    _class_call_check = _class_call_check.default;
    var MyClass = function MyClass() {
        "use strict";
        _class_call_check(this, MyClass);
    };
});
//// [file2.tsx]
// Should not elide React import
define([
    "require",
    "exports",
    "@swc/helpers/src/_interop_require_wildcard.mjs",
    "react",
    "./file1"
], function(require, exports, _interop_require_wildcard, _react, _file_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _interop_require_wildcard = _interop_require_wildcard.default;
    _react = /*#__PURE__*/ _interop_require_wildcard(_react);
    /*#__PURE__*/ _react.createElement(_file_1.MyClass, null);
});
