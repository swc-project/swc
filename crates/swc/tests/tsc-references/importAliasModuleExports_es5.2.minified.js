import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import A from "./mod1";
var Alias = function() {
    "use strict";
    function Alias() {
        _class_call_check(this, Alias);
    }
    return Alias.prototype.bar = function() {
        return 1;
    }, Alias;
}();
module.exports = Alias, A.prototype.foo = 0, A.prototype.func = function() {
    this._func = 0;
}, Object.defineProperty(A.prototype, "def", {
    value: 0
}), new A().bar, new A().foo, new A().func(), new A().def;
