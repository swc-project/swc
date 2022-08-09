//@jsx: preserve
//@module: amd
//@filename: react.d.ts
//@filename: file.tsx
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
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
