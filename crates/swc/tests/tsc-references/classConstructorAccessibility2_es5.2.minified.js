import * as swcHelpers from "@swc/helpers";
var BaseA = function() {
    function BaseA(x) {
        swcHelpers.classCallCheck(this, BaseA), this.x = x;
    }
    return BaseA.prototype.createInstance = function() {
        new BaseA(1);
    }, BaseA;
}(), BaseB = function() {
    function BaseB(x) {
        swcHelpers.classCallCheck(this, BaseB), this.x = x;
    }
    return BaseB.prototype.createInstance = function() {
        new BaseB(2);
    }, BaseB;
}(), BaseC = function() {
    function BaseC(x) {
        swcHelpers.classCallCheck(this, BaseC), this.x = x;
    }
    return BaseC.prototype.createInstance = function() {
        new BaseC(3);
    }, BaseC.staticInstance = function() {
        new BaseC(4);
    }, BaseC;
}(), DerivedA = function(BaseA1) {
    swcHelpers.inherits(DerivedA, BaseA1);
    var _super = swcHelpers.createSuper(DerivedA);
    function DerivedA(x) {
        var _this;
        return swcHelpers.classCallCheck(this, DerivedA), (_this = _super.call(this, x)).x = x, _this;
    }
    var _proto = DerivedA.prototype;
    return _proto.createInstance = function() {
        new DerivedA(5);
    }, _proto.createBaseInstance = function() {
        new BaseA(6);
    }, DerivedA.staticBaseInstance = function() {
        new BaseA(7);
    }, DerivedA;
}(BaseA), DerivedB = function(BaseB1) {
    swcHelpers.inherits(DerivedB, BaseB1);
    var _super = swcHelpers.createSuper(DerivedB);
    function DerivedB(x) {
        var _this;
        return swcHelpers.classCallCheck(this, DerivedB), (_this = _super.call(this, x)).x = x, _this;
    }
    var _proto = DerivedB.prototype;
    return _proto.createInstance = function() {
        new DerivedB(7);
    }, _proto.createBaseInstance = function() {
        new BaseB(8);
    }, DerivedB.staticBaseInstance = function() {
        new BaseB(9);
    }, DerivedB;
}(BaseB), DerivedC = function(BaseC1) {
    swcHelpers.inherits(DerivedC, BaseC1);
    var _super = swcHelpers.createSuper(DerivedC);
    function DerivedC(x) {
        var _this;
        return swcHelpers.classCallCheck(this, DerivedC), (_this = _super.call(this, x)).x = x, _this;
    }
    var _proto = DerivedC.prototype;
    return _proto.createInstance = function() {
        new DerivedC(9);
    }, _proto.createBaseInstance = function() {
        new BaseC(10);
    }, DerivedC.staticBaseInstance = function() {
        new BaseC(11);
    }, DerivedC;
}(BaseC);
new BaseA(1), new BaseB(1), new BaseC(1), new DerivedA(1), new DerivedB(1), new DerivedC(1);
