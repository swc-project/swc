import * as swcHelpers from "@swc/helpers";
var React = require("react");
function Greet(x) {
    return React.createElement("div", null, "Hello, ", x);
}
var BigGreeter = function(_Component) {
    "use strict";
    swcHelpers.inherits(BigGreeter, _Component);
    var _super = swcHelpers.createSuper(BigGreeter);
    function BigGreeter() {
        return swcHelpers.classCallCheck(this, BigGreeter), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(BigGreeter, [
        {
            key: "render",
            value: function() {
                return React.createElement("div", null);
            }
        }
    ]), BigGreeter;
}(React.Component);
React.createElement(Greet, null), React.createElement(Greet, {
    key: "k"
}), React.createElement(Greet, {
    ref: "myRef"
}), React.createElement(BigGreeter, {
    ref: function(x) {
        return x.greeting.substr(10);
    }
}), React.createElement(BigGreeter, {
    ref: function(x) {
        return x.greeting.subtr(10);
    }
}), React.createElement(BigGreeter, {
    ref: function(x) {
        return x.notARealProperty;
    }
}), React.createElement(BigGreeter, {
    key: 100
}), React.createElement("div", {
    ref: function(x) {
        return x.innerText;
    }
}), React.createElement("div", {
    ref: function(x) {
        return x.propertyNotOnHtmlDivElement;
    }
});
