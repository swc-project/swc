import * as swcHelpers from "@swc/helpers";
var A;
(function(A1) {
    var _$A = function _$A() {
        "use strict";
        swcHelpers.classCallCheck(this, _$A);
    };
    A1.A = _$A;
    var AG1 = function AG1() {
        "use strict";
        swcHelpers.classCallCheck(this, AG1);
    };
    A1.AG = AG1;
    var A2 = function A2() {
        "use strict";
        swcHelpers.classCallCheck(this, A2);
    };
    var AG2 = function AG2() {
        "use strict";
        swcHelpers.classCallCheck(this, AG2);
    };
})(A || (A = {}));
// no errors expected, these are all exported
var a;
var a = new A.A();
var AG = new A.AG();
// errors expected, these are not exported
var a2 = new A.A2();
var ag2 = new A.A2();
