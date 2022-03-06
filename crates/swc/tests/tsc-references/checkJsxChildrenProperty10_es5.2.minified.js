import * as swcHelpers from "@swc/helpers";
var Button = function() {
    "use strict";
    function Button() {
        swcHelpers.classCallCheck(this, Button);
    }
    return Button.prototype.render = function() {
        return React.createElement("div", null, "My Button");
    }, Button;
}();
React.createElement("div", null, " ", React.createElement("h2", null, " Hello "), " ", React.createElement("h1", null, " world ")), React.createElement("div", null, " ", React.createElement("h2", null, " Hello "), " ", function(user) {
    return React.createElement("h2", null, user.name);
}), React.createElement("div", null, " ", 1, " ", "That is a number", " "), React.createElement(Button, null, " ", React.createElement("h2", null, " Hello "), " ");
