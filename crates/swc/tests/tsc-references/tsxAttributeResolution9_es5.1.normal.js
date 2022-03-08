import * as swcHelpers from "@swc/helpers";
//@filename: file.tsx
export var MyComponent = /*#__PURE__*/ function() {
    "use strict";
    function MyComponent() {
        swcHelpers.classCallCheck(this, MyComponent);
    }
    var _proto = MyComponent.prototype;
    _proto.render = function render() {};
    return MyComponent;
}();
/*#__PURE__*/ React.createElement(MyComponent, {
    foo: "bar"
}); // ok  
/*#__PURE__*/ React.createElement(MyComponent, {
    foo: 0
}); // should be an error
