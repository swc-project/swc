import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Alias = function() {
    "use strict";
    function Alias() {
        _class_call_check(this, Alias);
    }
    var _proto = Alias.prototype;
    return _proto.bar = function() {
        return 1;
    }, Alias;
}();
module.exports = Alias;
import A from "./mod1";
A.prototype.foo = 0, A.prototype.func = function() {
    this._func = 0;
}, Object.defineProperty(A.prototype, "def", {
    value: 0
}), new A().bar, new A().foo, new A().func(), new A().def;
