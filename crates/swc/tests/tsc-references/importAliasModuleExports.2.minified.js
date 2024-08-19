//// [mod1.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Alias = /*#__PURE__*/ function() {
    function Alias() {
        _class_call_check(this, Alias);
    }
    return Alias.prototype.bar = function() {
        return 1;
    }, Alias;
}();
module.exports = Alias;
//// [main.js]
import A from './mod1';
A.prototype.foo = 0, A.prototype.func = function() {
    this._func = 0;
}, Object.defineProperty(A.prototype, "def", {
    value: 0
}), new A().bar, new A().foo, new A().func(), new A().def;
