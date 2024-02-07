//// [decoratorOnClassConstructor4.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _class_call_check = require("@swc/helpers/_/_class_call_check"), _inherits = require("@swc/helpers/_/_inherits"), _create_super = require("@swc/helpers/_/_create_super"), _ts_decorate = require("@swc/helpers/_/_ts_decorate"), _ts_metadata = require("@swc/helpers/_/_ts_metadata"), A = function A() {
    _class_call_check._(this, A);
};
A = _ts_decorate._([
    dec
], A);
var B = function B(x) {
    _class_call_check._(this, B);
};
B = _ts_decorate._([
    dec,
    _ts_metadata._("design:type", Function),
    _ts_metadata._("design:paramtypes", [
        Number
    ])
], B);
var C = function(A) {
    _inherits._(C, A);
    var _super = _create_super._(C);
    function C() {
        return _class_call_check._(this, C), _super.apply(this, arguments);
    }
    return C;
}(A);
_ts_decorate._([
    dec
], C);
