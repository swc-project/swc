import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
// @module: commonjs
// @target: esnext
// @filename: 0.ts
export function foo() {
    return "foo";
}
// @filename: 1.ts
export function backup() {
    return "backup";
}
function compute(promise) {
    return _compute.apply(this, arguments);
}
function _compute() {
    _compute = // @filename: 2.ts
    _async_to_generator(function*(promise) {
        let j = yield promise;
        if (!j) {
            j = yield import("./1");
            return j.backup();
        }
        return j.foo();
    });
    return _compute.apply(this, arguments);
}
compute(import("./0"));
