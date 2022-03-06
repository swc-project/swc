import * as swcHelpers from "@swc/helpers";
var A = function() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
}, B = function(A1) {
    "use strict";
    swcHelpers.inherits(B, A1);
    var _super = swcHelpers.createSuper(B);
    function B() {
        var _this;
        return swcHelpers.classCallCheck(this, B), _this = _super.apply(this, arguments), _this.foo = "string", _this;
    }
    return B;
}(A);
