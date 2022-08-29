//// [typeOfThisInStaticMembers4.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
_define_property(C, "a", 1), _define_property(C, "b", C.a + 1);
var D = function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D;
}(C);
_define_property(D, "c", 2), _define_property(D, "d", D.c + 1), _define_property(D, "e", _get(_get_prototype_of(D), "a", D) + D.c + 1);
