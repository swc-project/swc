import * as swcHelpers from "@swc/helpers";
var EE = function() {
    "use strict";
    function EE() {
        swcHelpers.classCallCheck(this, EE);
    }
    return swcHelpers.createClass(EE, [
        {
            key: "on",
            value: function(s) {}
        }
    ]), EE;
}(), npmlog = module.exports = new EE();
npmlog.on("hi"), module.exports.on("hi"), npmlog.x = 1, module.exports.y = 2, npmlog.y, module.exports.x;
var npmlog = require("./npmlog");
npmlog.x, npmlog.on;
