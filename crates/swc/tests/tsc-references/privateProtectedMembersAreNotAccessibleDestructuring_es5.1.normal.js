import * as swcHelpers from "@swc/helpers";
var K = /*#__PURE__*/ function() {
    "use strict";
    function K() {
        swcHelpers.classCallCheck(this, K);
    }
    swcHelpers.createClass(K, [
        {
            key: "privateMethod",
            value: function privateMethod() {}
        },
        {
            key: "m",
            value: function m() {
                var ref = this, a = ref.priv, b = ref.prot; // ok
                var ref1 = new K(), priv = ref1.priv, prot = ref1.prot; // ok
            }
        }
    ]);
    return K;
}();
var C = /*#__PURE__*/ function(K) {
    "use strict";
    swcHelpers.inherits(C, K);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(C, [
        {
            key: "m2",
            value: function m2() {
                var ref = this, a = ref.priv; // error
                var ref2 = this, b = ref2.prot; // ok
            }
        }
    ]);
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
