//// [privateProtectedMembersAreNotAccessibleDestructuring.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var k = new (function() {
    function K() {
        _class_call_check(this, K);
    }
    var _proto = K.prototype;
    return _proto.privateMethod = function() {}, _proto.m = function() {
        this.priv, this.prot;
        var _ref = new K();
        _ref.priv, _ref.prot;
    }, K;
}())();
k.priv, k.prot, k.privateMethod, k.priv, k.prot, k.privateMethod;
