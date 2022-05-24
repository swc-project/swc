import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
//@filename: file.tsx
var MyComponent = /*#__PURE__*/ function() {
    "use strict";
    function MyComponent() {
        _class_call_check(this, MyComponent);
    }
    var _proto = MyComponent.prototype;
    _proto.render = function render() {};
    return MyComponent;
}();
// Should be an OK
var x = /*#__PURE__*/ React.createElement(MyComponent, {
    bar: "world"
});
