import * as swcHelpers from "@swc/helpers";
export function foo() {}
export var Aleph = function() {
    function Aleph(a, b) {
        swcHelpers.classCallCheck(this, Aleph), this.field = b;
    }
    return Aleph.prototype.doIt = function() {}, Aleph;
}();
export var c = 12;
