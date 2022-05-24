import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Base = function Base(x) {
    "use strict";
    _class_call_check(this, Base);
    this.a = 1;
    this.a = x;
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        _class_call_check(this, Derived);
        var _this;
        _this = _super.apply(this, arguments);
        _this.x = 1;
        _this.y = "hello";
        return _this;
    }
    return Derived;
}(Base);
var r = new Derived(); // error
var r2 = new Derived(1);
var Base2 = function Base2(x) {
    "use strict";
    _class_call_check(this, Base2);
    this.a = x;
};
var D = /*#__PURE__*/ function(Base2) {
    "use strict";
    _inherits(D, Base2);
    var _super = _create_super(D);
    function D() {
        _class_call_check(this, D);
        var _this;
        _this = _super.apply(this, arguments);
        _this.x = 2;
        _this.y = null;
        return _this;
    }
    return D;
}(Base2);
var d = new D(); // error
var d2 = new D(new Date()); // ok
