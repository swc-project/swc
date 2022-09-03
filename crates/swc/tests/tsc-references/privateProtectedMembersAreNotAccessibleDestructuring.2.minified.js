//// [privateProtectedMembersAreNotAccessibleDestructuring.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var K = function() {
    "use strict";
    function K() {
        _class_call_check(this, K);
    }
    var _proto = K.prototype;
    return _proto.privateMethod = function() {}, _proto.m = function() {
        this.priv, this.prot;
        var ref = new K();
        ref.priv, ref.prot;
    }, K;
}(), C = function(K) {
    "use strict";
    _inherits(C, K);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C.prototype.m2 = function() {
        this.priv, this.prot;
    }, C;
}(K), k = new K(), priv = k.priv, prot = k.prot, privateMethod = k.privateMethod, a = k.priv, b = k.prot, pm = k.privateMethod;
function f(param) {
    param.priv, param.prot, param.privateMethod;
}
