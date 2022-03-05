import * as swcHelpers from "@swc/helpers";
var MyComponent = function() {
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
    bar: "world"
});
