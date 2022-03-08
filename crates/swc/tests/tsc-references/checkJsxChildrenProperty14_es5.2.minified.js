import * as swcHelpers from "@swc/helpers";
var React = require("react"), Button = function(_Component) {
    "use strict";
    swcHelpers.inherits(Button, _Component);
    var _super = swcHelpers.createSuper(Button);
    function Button() {
        return swcHelpers.classCallCheck(this, Button), _super.apply(this, arguments);
    }
    return Button.prototype.render = function() {
        return React.createElement("div", null, "My Button");
    }, Button;
}(React.Component);
function AnotherButton(p) {
    return React.createElement("h1", null, "Just Another Button");
}
function Comp(p) {
    return React.createElement("div", null, p.b);
}
function SingleChildComp(p) {
    return React.createElement("div", null, p.b);
}
React.createElement(Comp, {
    a: 10,
    b: "hi"
}, React.createElement(React.Fragment, null), React.createElement(Button, null), React.createElement(AnotherButton, null)), React.createElement(Comp, {
    a: 10,
    b: "hi"
}, React.createElement(React.Fragment, null, React.createElement(Button, null)), React.createElement(AnotherButton, null)), React.createElement(Comp, {
    a: 10,
    b: "hi"
}, React.createElement(React.Fragment, null, React.createElement(Button, null), React.createElement(AnotherButton, null))), React.createElement(SingleChildComp, {
    a: 10,
    b: "hi"
}, React.createElement(React.Fragment, null, React.createElement(Button, null), React.createElement(AnotherButton, null))), React.createElement(SingleChildComp, {
    a: 10,
    b: "hi"
}, React.createElement(React.Fragment, null), React.createElement(Button, null), React.createElement(AnotherButton, null));
