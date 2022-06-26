import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var MyComponent = function() {
    "use strict";
    function MyComponent() {
        _class_call_check(this, MyComponent);
    }
    return MyComponent.prototype.render = function() {}, MyComponent;
}();
