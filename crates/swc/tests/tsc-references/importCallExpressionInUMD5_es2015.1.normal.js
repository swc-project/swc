import * as swcHelpers from "@swc/helpers";
// @module: umd
// @target: es2015
// @filename: 0.ts
export function foo() {
    return "foo";
}
function func() {
    return _func.apply(this, arguments);
}
function _func() {
    _func = // @filename: 1.ts
    // https://github.com/microsoft/TypeScript/issues/36780
    swcHelpers.asyncToGenerator(function*() {
        const packageName = '.';
        const packageJson = yield import(packageName + '/package.json');
    });
    return _func.apply(this, arguments);
}
