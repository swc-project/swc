import * as swcHelpers from "@swc/helpers";
export var ex, crunch, Crunch = function() {
    "use strict";
    function Crunch(n) {
        swcHelpers.classCallCheck(this, Crunch), this.n = n;
    }
    return swcHelpers.createClass(Crunch, [
        {
            key: "m",
            value: function() {
                return this.n;
            }
        }
    ]), Crunch;
}();
new (require("./ex")).Crunch(1).n;
