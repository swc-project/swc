import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
// @module: system
// @target: es5
// @skipLibCheck: true
// @lib: es6
// @filename: foo.ts
export default "./foo";
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = // @filename: index.ts
    _async_to_generator(function*() {
        return yield import((yield import("./foo")).default);
    });
    return _foo.apply(this, arguments);
}
