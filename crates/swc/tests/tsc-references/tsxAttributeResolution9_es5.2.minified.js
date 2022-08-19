import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var MyComponent = function() {
    "use strict";
    function MyComponent() {
        _class_call_check(this, MyComponent);
    }
    var _proto = MyComponent.prototype;
    return _proto.render = function() {}, MyComponent;
}();
