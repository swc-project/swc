import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var A;
(function(A1) {
    var _$A = function _$A() {
        "use strict";
        _class_call_check(this, _$A);
    };
    A1.A = _$A;
    var AG1 = function AG1() {
        "use strict";
        _class_call_check(this, AG1);
    };
    A1.AG = AG1;
    var A2 = function A2() {
        "use strict";
        _class_call_check(this, A2);
    };
    var AG2 = function AG2() {
        "use strict";
        _class_call_check(this, AG2);
    };
})(A || (A = {}));
// no errors expected, these are all exported
var a;
var a = new A.A();
var AG = new A.AG();
// errors expected, these are not exported
var a2 = new A.A2();
var ag2 = new A.A2();
