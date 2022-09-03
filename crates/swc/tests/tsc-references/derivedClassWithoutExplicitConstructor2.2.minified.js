//// [derivedClassWithoutExplicitConstructor2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Base = function Base(x) {
    "use strict";
    _class_call_check(this, Base), this.a = 1, this.a = x;
}, Derived = function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        var _this;
        return _class_call_check(this, Derived), _this = _super.apply(this, arguments), _this.x = 1, _this.y = "hello", _this;
    }
    return Derived;
}(Base), r = new Derived(), r2 = new Derived(1), r3 = new Derived(1, 2), r4 = new Derived(1, 2, 3), Base2 = function Base2(x) {
    "use strict";
    _class_call_check(this, Base2), this.a = x;
}, D = function(Base2) {
    "use strict";
    _inherits(D, Base2);
    var _super = _create_super(D);
    function D() {
        var _this;
        return _class_call_check(this, D), _this = _super.apply(this, arguments), _this.x = 2, _this.y = null, _this;
    }
    return D;
}(Base2), d = new D(), d2 = new D(new Date()), d3 = new D(new Date(), new Date()), d4 = new D(new Date(), new Date(), new Date());
