import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
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
}(K), k = new K();
k.priv, k.prot, k.privateMethod, k.priv, k.prot, k.privateMethod;
