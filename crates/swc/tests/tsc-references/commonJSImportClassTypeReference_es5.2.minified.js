import * as swcHelpers from "@swc/helpers";
var K = require("./mod1").K, K = function() {
    "use strict";
    function K() {
        swcHelpers.classCallCheck(this, K);
    }
    return swcHelpers.createClass(K, [
        {
            key: "values",
            value: function() {
                return new K();
            }
        }
    ]), K;
}();
exports.K = K;
