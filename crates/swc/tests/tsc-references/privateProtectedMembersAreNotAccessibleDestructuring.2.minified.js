//// [privateProtectedMembersAreNotAccessibleDestructuring.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var k = new (function() {
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
}())();
k.priv, k.prot, k.privateMethod, k.priv, k.prot, k.privateMethod;
