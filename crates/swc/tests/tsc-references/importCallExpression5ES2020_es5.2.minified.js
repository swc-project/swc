import * as swcHelpers from "@swc/helpers";
export var specify, B = function() {
    function B() {
        swcHelpers.classCallCheck(this, B);
    }
    return B.prototype.print = function() {
        return "I am B";
    }, B;
}();
export function foo() {
    return "foo";
}
export function backup() {
    return "backup";
}
import(bar() ? "./0" : void 0), import(void 0), import(bar() ? "./1" : null), import(null);
