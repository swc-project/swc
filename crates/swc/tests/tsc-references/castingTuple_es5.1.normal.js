import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
    this.a = 10;
};
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var D = function D() {
    "use strict";
    _class_call_check(this, D);
};
var E = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(E, A);
    var _super = _create_super(E);
    function E() {
        _class_call_check(this, E);
        return _super.apply(this, arguments);
    }
    return E;
}(A);
var F = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(F, A);
    var _super = _create_super(F);
    function F() {
        _class_call_check(this, F);
        return _super.apply(this, arguments);
    }
    return F;
}(A);
var E1;
(function(E1) {
    E1[E1["one"] = 0] = "one";
})(E1 || (E1 = {}));
var E2;
(function(E2) {
    E2[E2["one"] = 0] = "one";
})(E2 || (E2 = {}));
// no error
var numStrTuple = [
    5,
    "foo"
];
var emptyObjTuple = numStrTuple;
var numStrBoolTuple = numStrTuple;
var shorter = numStrBoolTuple;
var longer = numStrTuple;
var classCDTuple = [
    new C(),
    new D()
];
var interfaceIITuple = classCDTuple;
var classCDATuple = classCDTuple;
var eleFromCDA1 = classCDATuple[2]; // A
var eleFromCDA2 = classCDATuple[5]; // C | D | A
var t10 = [
    E1.one,
    E2.one
];
var t11 = t10;
var array1 = emptyObjTuple;
var unionTuple = [
    new C(),
    "foo"
];
var unionTuple2 = [
    new C(),
    "foo",
    new D()
];
var unionTuple3 = [
    10,
    "foo"
];
var unionTuple4 = unionTuple3;
// error
var t3 = numStrTuple;
var t9 = classCDTuple;
var array1 = numStrTuple;
t4[2] = 10;
