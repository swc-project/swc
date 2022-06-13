import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Base = function(x) {
    "use strict";
    _class_call_check(this, Base), this.a = 1, this.a = x;
}, Derived = function(Base1) {
    "use strict";
    _inherits(Derived, Base1);
    var _super = _create_super(Derived);
    function Derived() {
        var _this;
        return _class_call_check(this, Derived), _this = _super.apply(this, arguments), _this.x = 1, _this.y = "hello", _this;
    }
    return Derived;
}(Base);
new Derived(), new Derived(1), new Derived(1, 2), new Derived(1, 2, 3);
var Base2 = function(x) {
    "use strict";
    _class_call_check(this, Base2), this.a = x;
}, D = function(Base21) {
    "use strict";
    _inherits(D, Base21);
    var _super = _create_super(D);
    function D() {
        var _this;
        return _class_call_check(this, D), _this = _super.apply(this, arguments), _this.x = 2, _this.y = null, _this;
    }
    return D;
}(Base2);
new D(), new D(new Date()), new D(new Date(), new Date()), new D(new Date(), new Date(), new Date());
