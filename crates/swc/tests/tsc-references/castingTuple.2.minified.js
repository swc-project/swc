//// [castingTuple.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var E1, E2, A = function A() {
    "use strict";
    _class_call_check(this, A), this.a = 10;
}, C = function C() {
    "use strict";
    _class_call_check(this, C);
}, D = function D() {
    "use strict";
    _class_call_check(this, D);
}, E = function(A) {
    "use strict";
    _inherits(E, A);
    var _super = _create_super(E);
    function E() {
        return _class_call_check(this, E), _super.apply(this, arguments);
    }
    return E;
}(A), F = function(A) {
    "use strict";
    _inherits(F, A);
    var _super = _create_super(F);
    function F() {
        return _class_call_check(this, F), _super.apply(this, arguments);
    }
    return F;
}(A);
!function(E1) {
    E1[E1.one = 0] = "one";
}(E1 || (E1 = {})), function(E2) {
    E2[E2.one = 0] = "one";
}(E2 || (E2 = {}));
var numStrTuple = [
    5,
    "foo"
], emptyObjTuple = numStrTuple, numStrBoolTuple = numStrTuple, shorter = numStrBoolTuple, longer = numStrTuple, classCDTuple = [
    new C(),
    new D()
], interfaceIITuple = classCDTuple, classCDATuple = classCDTuple, eleFromCDA1 = classCDATuple[2], eleFromCDA2 = classCDATuple[5], t10 = [
    E1.one,
    E2.one
], t11 = t10, array1 = emptyObjTuple, unionTuple = [
    new C(),
    "foo"
], unionTuple2 = [
    new C(),
    "foo",
    new D()
], unionTuple3 = [
    10,
    "foo"
], unionTuple4 = unionTuple3, t3 = numStrTuple, t9 = classCDTuple, array1 = numStrTuple;
t4[2] = 10;
