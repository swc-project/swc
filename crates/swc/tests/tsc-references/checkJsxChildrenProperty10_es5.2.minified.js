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
