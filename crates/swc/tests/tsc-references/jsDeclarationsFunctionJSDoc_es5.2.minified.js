import * as swcHelpers from "@swc/helpers";
export function foo() {}
export var Aleph = function() {
    "use strict";
    function Aleph(a, b) {
        swcHelpers.classCallCheck(this, Aleph), this.field = b;
    }
    return swcHelpers.createClass(Aleph, [
        {
            key: "doIt",
            value: function() {}
        }
    ]), Aleph;
}();
export var c = 12;
