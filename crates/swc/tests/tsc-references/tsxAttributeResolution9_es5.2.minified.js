import * as swcHelpers from "@swc/helpers";
export var MyComponent = function() {
    "use strict";
    function MyComponent() {
        swcHelpers.classCallCheck(this, MyComponent);
    }
    return swcHelpers.createClass(MyComponent, [
        {
            key: "render",
            value: function() {}
        }
    ]), MyComponent;
}();
React.createElement(MyComponent, {
    foo: "bar"
}), React.createElement(MyComponent, {
    foo: 0
});
