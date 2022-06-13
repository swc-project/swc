import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
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
