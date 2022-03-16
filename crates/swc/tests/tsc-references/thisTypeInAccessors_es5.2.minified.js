import * as swcHelpers from "@swc/helpers";
var Explicit = function() {
    "use strict";
    function Explicit() {
        swcHelpers.classCallCheck(this, Explicit), this.n = 17;
    }
    return swcHelpers.createClass(Explicit, [
        {
            key: "x",
            get: function() {
                return this.n;
            },
            set: function(n) {
                this.n = n;
            }
        }
    ]), Explicit;
}(), Contextual = function() {
    "use strict";
    function Contextual() {
        swcHelpers.classCallCheck(this, Contextual), this.n = 21;
    }
    return swcHelpers.createClass(Contextual, [
        {
            key: "x",
            get: function() {
                return this.n;
            }
        }
    ]), Contextual;
}();
