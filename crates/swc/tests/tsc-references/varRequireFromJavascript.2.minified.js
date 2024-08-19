//// [ex.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var Crunch = /*#__PURE__*/ function() {
    function Crunch(n) {
        _class_call_check(this, Crunch), this.n = n;
    }
    return Crunch.prototype.m = function() {
        return this.n;
    }, Crunch;
}();
//// [use.js]
new (require('./ex')).Crunch(1).n;
