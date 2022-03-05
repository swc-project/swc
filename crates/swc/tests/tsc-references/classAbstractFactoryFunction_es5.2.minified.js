import * as swcHelpers from "@swc/helpers";
var A = function() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
}, B = function(A1) {
    "use strict";
    swcHelpers.inherits(B, A1);
    var _super = swcHelpers.createSuper(B);
    function B() {
        return swcHelpers.classCallCheck(this, B), _super.apply(this, arguments);
    }
    return B;
}(A);
function NewA(Factory) {
    return new A;
}
function NewB(Factory) {
    return new B;
}
NewA(A), NewA(B), NewB(A), NewB(B);
