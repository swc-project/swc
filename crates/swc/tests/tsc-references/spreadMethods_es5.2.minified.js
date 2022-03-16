import * as swcHelpers from "@swc/helpers";
var K = function() {
    "use strict";
    function K() {
        swcHelpers.classCallCheck(this, K), this.p = 12;
    }
    return K.prototype.m = function() {}, swcHelpers.createClass(K, [
        {
            key: "g",
            get: function() {
                return 0;
            }
        }
    ]), K;
}(), k = new K(), sk = swcHelpers.objectSpread({}, k), ssk = swcHelpers.objectSpread({}, k, k);
sk.p, sk.m(), sk.g, ssk.p, ssk.m(), ssk.g;
var i = {
    p: 12,
    m: function() {},
    get g () {
        return 0;
    }
}, si = swcHelpers.objectSpread({}, i), ssi = swcHelpers.objectSpread({}, i, i);
si.p, si.m(), si.g, ssi.p, ssi.m(), ssi.g;
var o = {
    p: 12,
    m: function() {},
    get g () {
        return 0;
    }
}, so = swcHelpers.objectSpread({}, o), sso = swcHelpers.objectSpread({}, o, o);
so.p, so.m(), so.g, sso.p, sso.m(), sso.g;
