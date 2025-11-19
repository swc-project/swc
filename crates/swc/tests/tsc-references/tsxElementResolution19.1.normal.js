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
    "@swc/helpers/_/_class_call_check"
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
    var MyClass = function MyClass() {
        "use strict";
        _class_call_check._(this, MyClass);
    };
});
//// [file2.tsx]
// Should not elide React import
define([
    "require",
    "exports",
    "@swc/helpers/_/_interop_require_wildcard",
    "react",
    "./file1"
], function(require, exports, _interop_require_wildcard, _react, _file1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _react = /*#__PURE__*/ _interop_require_wildcard._(_react);
    /*#__PURE__*/ _react.createElement(_file1.MyClass, null);
});
