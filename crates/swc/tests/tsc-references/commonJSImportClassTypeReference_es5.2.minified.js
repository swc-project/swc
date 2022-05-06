import * as swcHelpers from "@swc/helpers";
var K = (require("./mod1").K, function() {
    "use strict";
    function K() {
        swcHelpers.classCallCheck(this, K);
    }
    return K.prototype.values = function() {
        return new K();
    }, K;
}());
exports.K = K;
