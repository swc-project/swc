import * as swcHelpers from "@swc/helpers";
var abstract = function() {
    "use strict";
    function abstract() {
        swcHelpers.classCallCheck(this, abstract);
    }
    return abstract.prototype.foo = function() {
        return 1;
    }, abstract;
}();
new abstract;
