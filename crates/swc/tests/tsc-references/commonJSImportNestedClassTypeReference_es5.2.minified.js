import * as swcHelpers from "@swc/helpers";
require("./mod1").K;
var NS = {};
NS.K = function() {
    function _class() {
        swcHelpers.classCallCheck(this, _class);
    }
    return _class.prototype.values = function() {
        return new NS.K();
    }, _class;
}(), exports.K = NS.K;
