import * as swcHelpers from "@swc/helpers";
function f() {
    return _f.apply(this, arguments);
}
function _f() {
    _f = // @target: es5
    // @lib: es5,es2015.promise
    // @filename: a.ts
    swcHelpers.asyncToGenerator(function*() {});
    return _f.apply(this, arguments);
}
// @filename: b.ts
function g() {}
