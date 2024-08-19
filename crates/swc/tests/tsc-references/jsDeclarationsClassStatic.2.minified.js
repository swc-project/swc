//// [source.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
var Handler = /*#__PURE__*/ function() {
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
