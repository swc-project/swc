import * as swcHelpers from "@swc/helpers";
var MyComponent = //@filename: file.tsx
/*#__PURE__*/ function() {
    "use strict";
    function MyComponent() {
        swcHelpers.classCallCheck(this, MyComponent);
    }
    var _proto = MyComponent.prototype;
    _proto.render = function render() {};
    return MyComponent;
}();
// Should be an OK
var x = /*#__PURE__*/ React.createElement(MyComponent, {
    bar: "world"
});
