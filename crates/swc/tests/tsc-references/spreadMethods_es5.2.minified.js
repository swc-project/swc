import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
var K = function() {
    "use strict";
    function K() {
        _class_call_check(this, K), this.p = 12;
    }
    return K.prototype.m = function() {}, _create_class(K, [
        {
            key: "g",
            get: function() {
                return 0;
            }
        }
    ]), K;
}(), k = new K(), sk = _object_spread({}, k), ssk = _object_spread({}, k, k);
sk.p, sk.m(), sk.g, ssk.p, ssk.m(), ssk.g;
var i = {
    p: 12,
    m: function() {},
    get g () {
        return 0;
    }
}, si = _object_spread({}, i), ssi = _object_spread({}, i, i);
si.p, si.m(), si.g, ssi.p, ssi.m(), ssi.g;
var o = {
    p: 12,
    m: function() {},
    get g () {
        return 0;
    }
}, so = _object_spread({}, o), sso = _object_spread({}, o, o);
so.p, so.m(), so.g, sso.p, sso.m(), sso.g;
