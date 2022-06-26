import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Bar = function() {
    "use strict";
    function Bar(d) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 10;
        _class_call_check(this, Bar), this.d = d, this.e = e, this.c = 2;
    }
    var _proto = Bar.prototype;
    return _proto.f = function() {
        return 1;
    }, _proto.h = function() {
        return 2;
    }, Bar;
}(), Base = function() {
    "use strict";
    _class_call_check(this, Base);
}, Derived = function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        var _this;
        return _class_call_check(this, Derived), _this = _super.apply(this, arguments), _this.a = 1, _this;
    }
    return Derived.prototype.f = function() {
        return 1;
    }, Derived;
}(Base);
