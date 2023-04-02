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
], function(require, exports, _class_call_check) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "MyComponent", {
        enumerable: !0,
        get: function() {
            return MyComponent;
        }
    }), _class_call_check = _class_call_check.default;
    var MyComponent = function() {
        "use strict";
        function MyComponent() {
            _class_call_check(this, MyComponent);
        }
        return MyComponent.prototype.render = function() {}, MyComponent;
    }();
});
