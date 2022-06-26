import _assert_this_initialized from "@swc/helpers/src/_assert_this_initialized.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C), this.self = this, this.c = new C();
    }
    var _proto = C.prototype;
    return _proto.foo = function() {
        return this;
    }, _proto.f1 = function() {
        this.c = this.self, this.self = this.c;
    }, _proto.f2 = function() {
        this.c, this.self;
    }, _proto.f3 = function(b) {
        return b ? this.c : this.self;
    }, C;
}(), D = function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        var _this;
        return _class_call_check(this, D), _this = _super.apply(this, arguments), _this.self1 = _assert_this_initialized(_this), _this.self2 = _this.self, _this.self3 = _this.foo(), _this.d = new D(), _this;
    }
    return D.prototype.bar = function() {
        this.self = this.self1, this.self = this.self2, this.self = this.self3, this.self1 = this.self, this.self2 = this.self, this.self3 = this.self, this.d = this.self, this.d = this.c, this.self = this.d, this.c = this.d;
    }, D;
}(C);
