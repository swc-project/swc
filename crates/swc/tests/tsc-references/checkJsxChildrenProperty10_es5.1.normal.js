import * as swcHelpers from "@swc/helpers";
var Button = /*#__PURE__*/ function() {
    "use strict";
    function Button() {
        swcHelpers.classCallCheck(this, Button);
    }
    var _proto = Button.prototype;
    _proto.render = function render() {
        return(/*#__PURE__*/ React.createElement("div", null, "My Button"));
    };
    return Button;
}();
// OK
var k1 = /*#__PURE__*/ React.createElement("div", null, " ", /*#__PURE__*/ React.createElement("h2", null, " Hello "), " ", /*#__PURE__*/ React.createElement("h1", null, " world "));
var k2 = /*#__PURE__*/ React.createElement("div", null, " ", /*#__PURE__*/ React.createElement("h2", null, " Hello "), " ", function(user) {
    /*#__PURE__*/ return React.createElement("h2", null, user.name);
});
var k3 = /*#__PURE__*/ React.createElement("div", null, " ", 1, " ", "That is a number", " ");
var k4 = /*#__PURE__*/ React.createElement(Button, null, " ", /*#__PURE__*/ React.createElement("h2", null, " Hello "), " ");
