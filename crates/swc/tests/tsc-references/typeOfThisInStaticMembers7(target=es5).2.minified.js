//// [typeOfThisInStaticMembers7.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
C.a = 1, C.b = C.a + 1;
var D = function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D;
}(C);
D.c = 2, D.d = D.c + 1, D.e = 1 + _get(_get_prototype_of(D), "a", D) + (D.c + 1) + 1;
