// @module: es2015
// @target: es5
// @skipLibCheck: true
// @lib: es6
// @filename: foo.ts
export default "./foo";
// @filename: index.ts
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _async_to_generator(function*() {
        return yield import((yield import("./foo")).default);
    });
    return _foo.apply(this, arguments);
}
