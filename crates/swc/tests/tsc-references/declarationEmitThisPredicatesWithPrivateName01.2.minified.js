//// [declarationEmitThisPredicatesWithPrivateName01.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "C", {
    enumerable: !0,
    get: function() {
        return C;
    }
});
var _class_call_check = require("@swc/helpers/_/_class_call_check"), _inherits = require("@swc/helpers/_/_inherits"), _instanceof = require("@swc/helpers/_/_instanceof"), _create_super = require("@swc/helpers/_/_create_super"), C = function() {
    function C() {
        _class_call_check._(this, C);
    }
    return C.prototype.m = function() {
        return _instanceof._(this, D);
    }, C;
}(), D = function(C) {
    _inherits._(D, C);
    var _super = _create_super._(D);
    function D() {
        return _class_call_check._(this, D), _super.apply(this, arguments);
    }
    return D;
}(C);
