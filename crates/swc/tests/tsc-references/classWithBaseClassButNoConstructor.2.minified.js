//// [classWithBaseClassButNoConstructor.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Base = function Base(x) {
    "use strict";
    _class_call_check(this, Base);
}, C = function(Base) {
    "use strict";
    _inherits(C, Base);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(Base), r = C, c = new C(), c2 = new C(1), Base2 = function Base2(x) {
    "use strict";
    _class_call_check(this, Base2);
}, D = function(Base2) {
    "use strict";
    _inherits(D, Base2);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D;
}(Base2), r2 = D, d = new D(), d2 = new D(1), D2 = function(Base2) {
    "use strict";
    _inherits(D2, Base2);
    var _super = _create_super(D2);
    function D2() {
        return _class_call_check(this, D2), _super.apply(this, arguments);
    }
    return D2;
}(Base2), r3 = D2, d3 = new D(), d4 = new D(1), D3 = function(Base2) {
    "use strict";
    _inherits(D3, Base2);
    var _super = _create_super(D3);
    function D3() {
        return _class_call_check(this, D3), _super.apply(this, arguments);
    }
    return D3;
}(Base2), r4 = D3, d5 = new D(), d6 = new D(1);
