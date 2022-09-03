//// [unionTypesAssignability.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var unionNumberString, unionDE, num, str, c, d, e, anyVar, C = function C() {
    "use strict";
    _class_call_check(this, C);
}, D = function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D.prototype.foo1 = function() {}, D;
}(C), E = function(C) {
    "use strict";
    _inherits(E, C);
    var _super = _create_super(E);
    function E() {
        return _class_call_check(this, E), _super.apply(this, arguments);
    }
    return E.prototype.foo2 = function() {}, E;
}(C);
function foo(t, u) {
    var x;
    u = t = u, x = t, x = u, t = x = void 0, u = x;
}
c = d, c = e, c = unionDE, d = e, e = d = unionDE, e = unionDE, num = str, str = num = unionNumberString, str = unionNumberString, d = c, e = c, unionDE = c, e = d, unionDE = d, d = e, unionDE = e, str = num, unionNumberString = num, num = str, unionNumberString = str, anyVar = unionDE, unionDE = anyVar = unionNumberString, unionNumberString = anyVar, unionDE = null, unionNumberString = null, unionDE = void 0, unionNumberString = void 0;
