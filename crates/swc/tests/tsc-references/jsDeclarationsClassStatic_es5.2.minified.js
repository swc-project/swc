import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var Handler = function() {
    "use strict";
    function Handler() {
        _class_call_check(this, Handler);
    }
    return Handler.prototype.process = function() {}, _create_class(Handler, null, [
        {
            key: "OPTIONS",
            get: function() {
                return 1;
            }
        }
    ]), Handler;
}();
Handler.statische = function() {}, module.exports = Handler, module.exports.Strings = {
    a: "A",
    b: "B"
};
