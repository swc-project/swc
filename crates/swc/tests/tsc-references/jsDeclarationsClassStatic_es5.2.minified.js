import * as swcHelpers from "@swc/helpers";
var Handler = function() {
    function Handler() {
        swcHelpers.classCallCheck(this, Handler);
    }
    return Handler.prototype.process = function() {}, swcHelpers.createClass(Handler, null, [
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
