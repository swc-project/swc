function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var Button = /*#__PURE__*/ function() {
    "use strict";
    function Button() {
        _classCallCheck(this, Button);
    }
    _createClass(Button, [
        {
            key: "render",
            value: function render() {
                return(/*#__PURE__*/ React.createElement("div", null, "My Button"));
            }
        }
    ]);
    return Button;
}();
// OK
var k1 = /*#__PURE__*/ React.createElement("div", null, " ", /*#__PURE__*/ React.createElement("h2", null, " Hello "), " ", /*#__PURE__*/ React.createElement("h1", null, " world "));
var k2 = /*#__PURE__*/ React.createElement("div", null, " ", /*#__PURE__*/ React.createElement("h2", null, " Hello "), " ", function(user) {
    /*#__PURE__*/ return React.createElement("h2", null, user.name);
});
var k3 = /*#__PURE__*/ React.createElement("div", null, " ", 1, " ", "That is a number", " ");
var k4 = /*#__PURE__*/ React.createElement(Button, null, " ", /*#__PURE__*/ React.createElement("h2", null, " Hello "), " ");
