import * as swcHelpers from "@swc/helpers";
var Handler = function() {
    "use strict";
    function Handler() {
        swcHelpers.classCallCheck(this, Handler);
    }
    return swcHelpers.createClass(Handler, [
        {
            key: "process",
            value: function() {}
        }
    ], [
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
