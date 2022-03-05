import * as swcHelpers from "@swc/helpers";
// @module: es2015
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
    swcHelpers.asyncToGenerator(function*() {
        return yield import((yield import("./foo")).default);
    });
    return _foo.apply(this, arguments);
}
