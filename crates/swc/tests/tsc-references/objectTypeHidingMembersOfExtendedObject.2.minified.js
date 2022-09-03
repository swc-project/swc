//// [objectTypeHidingMembersOfExtendedObject.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var c, i, b, A = function A() {
    "use strict";
    _class_call_check(this, A);
}, B = function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        return _class_call_check(this, B), _super.apply(this, arguments);
    }
    return B;
}(A), C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.valueOf = function() {}, C;
}(), r1 = c.valueOf(), r1b = c.data, r1c = r1b.hm, r1d = c.hm, r2 = i.valueOf(), r2b = i.data, r2c = r2b.hm, r2d = i.hm, a = {
    valueOf: function() {},
    data: new B()
}, r3 = a.valueOf(), r3b = a.data, r3c = r3b.hm, r3d = i.hm, r4 = b.valueOf();
