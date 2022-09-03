//// [unionTypeFromArrayLiteral.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var c, d, e, f, arr1 = [
    1,
    2
], arr2 = [
    "hello",
    !0
], arr3Tuple = [
    3,
    "three"
], arr4Tuple = [
    3,
    "three",
    "hello"
], arrEmpty = [], arr5Tuple = [
    "hello",
    !0,
    !1,
    " hello",
    !0,
    10,
    "any"
], C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function() {}, C;
}(), D = function() {
    "use strict";
    function D() {
        _class_call_check(this, D);
    }
    return D.prototype.foo2 = function() {}, D;
}(), E = function(C) {
    "use strict";
    _inherits(E, C);
    var _super = _create_super(E);
    function E() {
        return _class_call_check(this, E), _super.apply(this, arguments);
    }
    return E.prototype.foo3 = function() {}, E;
}(C), F = function(C) {
    "use strict";
    _inherits(F, C);
    var _super = _create_super(F);
    function F() {
        return _class_call_check(this, F), _super.apply(this, arguments);
    }
    return F.prototype.foo4 = function() {}, F;
}(C), arr6 = [
    c,
    d
], arr7 = [
    c,
    d,
    e
], arr8 = [
    c,
    e
], arr9 = [
    e,
    f
];
