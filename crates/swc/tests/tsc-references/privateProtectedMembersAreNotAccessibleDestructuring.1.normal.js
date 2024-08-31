//// [privateProtectedMembersAreNotAccessibleDestructuring.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var K = /*#__PURE__*/ function() {
    "use strict";
    function K() {
        _class_call_check(this, K);
    }
    var _proto = K.prototype;
    _proto.privateMethod = function privateMethod() {};
    _proto.m = function m() {
        var _this = this, a = _this.priv, b = _this.prot; // ok
        var _ref = new K(), priv = _ref.priv, prot = _ref.prot; // ok
    };
    return K;
}();
var C = /*#__PURE__*/ function(K) {
    "use strict";
    _inherits(C, K);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    var _proto = C.prototype;
    _proto.m2 = function m2() {
        var _this = this, a = _this.priv; // error
        var _this1 = this, b = _this1.prot; // ok
    };
    return C;
}(K);
var k = new K();
var priv = k.priv; // error
var prot = k.prot; // error
var privateMethod = k.privateMethod; // error
var a = k.priv, b = k.prot, pm = k.privateMethod; // error
function f(param) {
    var priv = param.priv, prot = param.prot, privateMethod = param.privateMethod;
}
