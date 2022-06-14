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
    function Derived(y, z) {
        var _this;
        return _class_call_check(this, Derived), (_this = _super.call(this, 2)).b = "", _this.b = y, _this;
    }
    return Derived;
}(Base), Derived2 = function(Derived) {
    "use strict";
    _inherits(Derived2, Derived);
    var _super = _create_super(Derived2);
    function Derived2() {
        var _this;
        return _class_call_check(this, Derived2), _this = _super.apply(this, arguments), _this.x = 1, _this.y = "hello", _this;
    }
    return Derived2;
}(Derived);
new Derived(), new Derived2(1), new Derived("", "");
var Base2 = function(x) {
    "use strict";
    _class_call_check(this, Base2), this.a = x;
}, D = function(Base3) {
    "use strict";
    _inherits(D, Base3);
    var _super = _create_super(D);
    function D(y, z) {
        var _this;
        return _class_call_check(this, D), (_this = _super.call(this, 2)).b = null, _this.b = y, _this;
    }
    return D;
}(Base), D2 = function(D) {
    "use strict";
    _inherits(D2, D);
    var _super = _create_super(D2);
    function D2() {
        var _this;
        return _class_call_check(this, D2), _this = _super.apply(this, arguments), _this.x = 2, _this.y = null, _this;
    }
    return D2;
}(D);
new D2(), new D2(new Date()), new D2(new Date(), new Date());
