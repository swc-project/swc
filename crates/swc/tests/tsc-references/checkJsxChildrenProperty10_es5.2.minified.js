import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var Button = function() {
    "use strict";
    function Button() {
        _class_call_check(this, Button);
    }
    return Button.prototype.render = function() {
        return React.createElement("div", null, "My Button");
    }, Button;
}();
