import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
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
    _async_to_generator(function*() {
        const packageName = '.';
        const packageJson = yield import(packageName + '/package.json');
    });
    return _func.apply(this, arguments);
}
