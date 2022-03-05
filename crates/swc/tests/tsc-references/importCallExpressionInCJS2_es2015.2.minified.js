import * as swcHelpers from "@swc/helpers";
export function foo() {
    return "foo";
}
export function backup() {
    return "backup";
}
function _compute() {
    return (_compute = swcHelpers.asyncToGenerator(function*(promise) {
        let j = yield promise;
        return j ? j.foo() : (j = yield import("./1")).backup();
    })).apply(this, arguments);
}
!function(promise) {
    return _compute.apply(this, arguments);
}(import("./0"));
