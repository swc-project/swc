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
// Should not elide React import
define([
    "require",
    "exports",
    "@swc/helpers/src/_interop_require_wildcard.mjs",
    "react",
    "./file1"
], function(require, exports, _interopRequireWildcard, _react, _file1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _interopRequireWildcard = _interopRequireWildcard.default;
    _react = /*#__PURE__*/ _interopRequireWildcard(_react);
    /*#__PURE__*/ _react.createElement(_file1.MyClass, null);
});
