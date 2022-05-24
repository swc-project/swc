import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
export function foo() {
    return "foo";
}
export function backup() {
    return "backup";
}
function _compute() {
    return (_compute = _async_to_generator(function*(promise) {
        let j = yield promise;
        return j ? j.foo() : (j = yield import("./1")).backup();
    })).apply(this, arguments);
}
!function(promise) {
    return _compute.apply(this, arguments);
}(import("./0"));
