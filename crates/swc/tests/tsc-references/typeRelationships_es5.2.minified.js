import * as swcHelpers from "@swc/helpers";
var C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C), this.self = this, this.c = new C();
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
    swcHelpers.inherits(D, C);
    var _super = swcHelpers.createSuper(D);
    function D() {
        var _this;
        return swcHelpers.classCallCheck(this, D), _this = _super.apply(this, arguments), _this.self1 = swcHelpers.assertThisInitialized(_this), _this.self2 = _this.self, _this.self3 = _this.foo(), _this.d = new D(), _this;
    }
    return D.prototype.bar = function() {
        this.self = this.self1, this.self = this.self2, this.self = this.self3, this.self1 = this.self, this.self2 = this.self, this.self3 = this.self, this.d = this.self, this.d = this.c, this.self = this.d, this.c = this.d;
    }, D;
}(C);
