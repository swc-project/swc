import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var K = /*#__PURE__*/ function() {
    "use strict";
    function K() {
        _class_call_check(this, K);
    }
    var _proto = K.prototype;
    _proto.privateMethod = function privateMethod() {};
    _proto.m = function m() {
        var ref = this, a = ref.priv, b = ref.prot; // ok
        var ref1 = new K(), priv = ref1.priv, prot = ref1.prot; // ok
    };
    return K;
}();
var C = /*#__PURE__*/ function(K) {
    "use strict";
    _inherits(C, K);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    var _proto = C.prototype;
    _proto.m2 = function m2() {
        var ref = this, a = ref.priv; // error
        var ref2 = this, b = ref2.prot; // ok
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
