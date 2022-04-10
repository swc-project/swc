import * as swcHelpers from "@swc/helpers";
var _this = this, B = function() {
    function B() {
        swcHelpers.classCallCheck(this, B), this.n = 1;
    }
    return B.prototype.foo = function() {}, B;
}(), C = function(B) {
    swcHelpers.inherits(C, B);
    var _super = swcHelpers.createSuper(C);
    function C() {
        return swcHelpers.classCallCheck(this, C), _super.apply(this, arguments);
    }
    return C;
}(B);
C.prototype.foo = function() {};
var D = function(B) {
    swcHelpers.inherits(D, B);
    var _super = swcHelpers.createSuper(D);
    function D() {
        return swcHelpers.classCallCheck(this, D), _super.apply(this, arguments);
    }
    return D;
}(B);
D.prototype.foo = function() {
    _this.n = "not checked, so no error";
};
var Module = function() {
    swcHelpers.classCallCheck(this, Module);
};
Module.prototype.identifier = void 0, Module.prototype.size = null;
var NormalModule = function(Module1) {
    swcHelpers.inherits(NormalModule, Module1);
    var _super = swcHelpers.createSuper(NormalModule);
    function NormalModule() {
        return swcHelpers.classCallCheck(this, NormalModule), _super.apply(this, arguments);
    }
    var _proto = NormalModule.prototype;
    return _proto.identifier = function() {
        return "normal";
    }, _proto.size = function() {
        return 0;
    }, NormalModule;
}(Module);
