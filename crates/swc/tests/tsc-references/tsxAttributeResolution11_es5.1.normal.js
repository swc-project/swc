import * as swcHelpers from "@swc/helpers";
var MyComponent = //@filename: file.tsx
/*#__PURE__*/ function() {
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
// Should be an OK
var x = /*#__PURE__*/ React.createElement(MyComponent, {
    bar: "world"
});
