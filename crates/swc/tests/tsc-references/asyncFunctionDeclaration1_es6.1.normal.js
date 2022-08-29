//// [asyncFunctionDeclaration1_es6.ts]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _async_to_generator(function*() {});
    return _foo.apply(this, arguments);
}
