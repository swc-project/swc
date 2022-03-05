import * as swcHelpers from "@swc/helpers";
require("./mod1").K;
var NS = {};
NS.K = (function() {
    "use strict";
    function _class() {
        swcHelpers.classCallCheck(this, _class);
    }
    return swcHelpers.createClass(_class, [
        {
            key: "values",
            value: function() {
                return new NS.K();
            }
        }
    ]), _class;
})(), exports.K = NS.K;
