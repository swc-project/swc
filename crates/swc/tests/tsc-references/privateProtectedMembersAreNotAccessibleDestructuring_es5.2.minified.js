import * as swcHelpers from "@swc/helpers";
var K = function() {
    "use strict";
    function K() {
        swcHelpers.classCallCheck(this, K);
    }
    var _proto = K.prototype;
    return _proto.privateMethod = function() {}, _proto.m = function() {
        this.priv, this.prot;
        var ref = new K();
        ref.priv, ref.prot;
    }, K;
}(), C = function(K) {
    "use strict";
    swcHelpers.inherits(C, K);
    var _super = swcHelpers.createSuper(C);
    function C() {
        return swcHelpers.classCallCheck(this, C), _super.apply(this, arguments);
    }
    return C.prototype.m2 = function() {
        this.priv, this.prot;
    }, C;
}(K), k = new K();
k.priv, k.prot, k.privateMethod, k.priv, k.prot, k.privateMethod;
