//// [tsxAttributeResolution9.tsx]
define([
    "require"
], function(require) {});
//// [react.d.ts]
define([
    "require"
], function(require) {});
//// [file.tsx]
define([
    "require",
    "exports",
    "@swc/helpers/src/_class_call_check.mjs"
], function(require, exports, _classCallCheck) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "MyComponent", {
        enumerable: !0,
        get: function() {
            return MyComponent;
        }
    }), _classCallCheck = _classCallCheck.default;
    var MyComponent = function() {
        "use strict";
        function MyComponent() {
            _classCallCheck(this, MyComponent);
        }
        return MyComponent.prototype.render = function() {}, MyComponent;
    }();
});
