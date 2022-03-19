import * as swcHelpers from "@swc/helpers";
import A from './mod1';
var Alias = function() {
    "use strict";
    function Alias() {
        swcHelpers.classCallCheck(this, Alias);
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
