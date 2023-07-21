//// [classConstructorAccessibility2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var BaseA = function() {
    function BaseA(x) {
        _class_call_check(this, BaseA), this.x = x;
    }
    return BaseA.prototype.createInstance = function() {
        new BaseA(1);
    }, BaseA;
}(), BaseB = function() {
    function BaseB(x) {
        _class_call_check(this, BaseB), this.x = x;
    }
    return BaseB.prototype.createInstance = function() {
        new BaseB(2);
    }, BaseB;
}(), BaseC = function() {
    function BaseC(x) {
        _class_call_check(this, BaseC), this.x = x;
    }
    return BaseC.prototype.createInstance = function() {
        new BaseC(3);
    }, BaseC.staticInstance = function() {
        new BaseC(4);
    }, BaseC;
}(), DerivedA = function(BaseA1) {
    _inherits(DerivedA, BaseA1);
    var _super = _create_super(DerivedA);
    function DerivedA(x) {
        var _this;
        return _class_call_check(this, DerivedA), (_this = _super.call(this, x)).x = x, _this;
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
    _inherits(DerivedB, BaseB1);
    var _super = _create_super(DerivedB);
    function DerivedB(x) {
        var _this;
        return _class_call_check(this, DerivedB), (_this = _super.call(this, x)).x = x, _this;
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
    _inherits(DerivedC, BaseC1);
    var _super = _create_super(DerivedC);
    function DerivedC(x) {
        var _this;
        return _class_call_check(this, DerivedC), (_this = _super.call(this, x)).x = x, _this;
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
