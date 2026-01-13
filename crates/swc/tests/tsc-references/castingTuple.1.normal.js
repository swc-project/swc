//// [castingTuple.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
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
    function E() {
        _class_call_check(this, E);
        return _call_super(this, E, arguments);
    }
    return E;
}(A);
var F = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(F, A);
    function F() {
        _class_call_check(this, F);
        return _call_super(this, F, arguments);
    }
    return F;
}(A);
var E1 = /*#__PURE__*/ function(E1) {
    E1[E1["one"] = 0] = "one";
    return E1;
}(E1 || {});
var E2 = /*#__PURE__*/ function(E2) {
    E2[E2["one"] = 0] = "one";
    return E2;
}(E2 || {});
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
    0,
    0
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
