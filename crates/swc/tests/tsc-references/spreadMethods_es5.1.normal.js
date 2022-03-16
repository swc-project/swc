import * as swcHelpers from "@swc/helpers";
// @target: esnext
// @useDefineForClassFields: false
var K = /*#__PURE__*/ function() {
    "use strict";
    function K() {
        swcHelpers.classCallCheck(this, K);
        this.p = 12;
    }
    var _proto = K.prototype;
    _proto.m = function m() {};
    swcHelpers.createClass(K, [
        {
            key: "g",
            get: function get() {
                return 0;
            }
        }
    ]);
    return K;
}();
var k = new K();
var sk = swcHelpers.objectSpread({}, k);
var ssk = swcHelpers.objectSpread({}, k, k);
sk.p;
sk.m(); // error
sk.g; // error
ssk.p;
ssk.m(); // error
ssk.g; // error
var i = {
    p: 12,
    m: function m() {},
    get g () {
        return 0;
    }
};
var si = swcHelpers.objectSpread({}, i);
var ssi = swcHelpers.objectSpread({}, i, i);
si.p;
si.m(); // ok
si.g; // ok
ssi.p;
ssi.m(); // ok
ssi.g; // ok
var o = {
    p: 12,
    m: function m() {},
    get g () {
        return 0;
    }
};
var so = swcHelpers.objectSpread({}, o);
var sso = swcHelpers.objectSpread({}, o, o);
so.p;
so.m(); // ok
so.g; // ok
sso.p;
sso.m(); // ok
sso.g; // ok
