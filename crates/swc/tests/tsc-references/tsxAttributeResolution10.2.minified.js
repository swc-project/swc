//// [tsxAttributeResolution10.tsx]
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
    "@swc/helpers/_/_class_call_check"
], function(require, exports, _class_call_check) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "MyComponent", {
        enumerable: !0,
        get: function() {
            return MyComponent;
        }
    });
    var MyComponent = /*#__PURE__*/ function() {
        function MyComponent() {
            _class_call_check._(this, MyComponent);
        }
        return MyComponent.prototype.render = function() {}, MyComponent;
    }();
});
