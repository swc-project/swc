import * as swcHelpers from "@swc/helpers";
export var MyComponent = function() {
    "use strict";
    function MyComponent() {
        swcHelpers.classCallCheck(this, MyComponent);
    }
    return MyComponent.prototype.render = function() {}, MyComponent;
}();
React.createElement(MyComponent, {
    bar: "world"
}), React.createElement(MyComponent, {
    bar: !0
}), React.createElement(MyComponent, {
    "data-bar": "hello"
});
