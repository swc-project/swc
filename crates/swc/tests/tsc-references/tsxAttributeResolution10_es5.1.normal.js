import * as swcHelpers from "@swc/helpers";
//@filename: file.tsx
export var MyComponent = /*#__PURE__*/ function() {
    "use strict";
    function MyComponent() {
        swcHelpers.classCallCheck(this, MyComponent);
    }
    swcHelpers.createClass(MyComponent, [
        {
            key: "render",
            value: function render() {}
        }
    ]);
    return MyComponent;
}();
// Should be an error
/*#__PURE__*/ React.createElement(MyComponent, {
    bar: "world"
});
// Should be OK
/*#__PURE__*/ React.createElement(MyComponent, {
    bar: true
});
// Should be ok
/*#__PURE__*/ React.createElement(MyComponent, {
    "data-bar": "hello"
});
