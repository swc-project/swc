//// [ex.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var Crunch = function() {
    function Crunch(n) {
        _class_call_check(this, Crunch), this.n = n;
    }
    var _proto = Crunch.prototype;
    return _proto.m = function() {
        return this.n;
    }, Crunch;
}();
//// [use.js]
new (require("./ex")).Crunch(1).n;
