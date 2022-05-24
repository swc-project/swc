import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
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
}, Derived = function(Base1) {
    "use strict";
    _inherits(Derived, Base1);
    var _super = _create_super(Derived);
    function Derived() {
        var _this;
        return _class_call_check(this, Derived), _this = _super.apply(this, arguments), _this.a = 1, _this;
    }
    return Derived.prototype.f = function() {
        return 1;
    }, Derived;
}(Base);
