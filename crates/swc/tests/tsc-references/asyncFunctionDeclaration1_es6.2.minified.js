//// [asyncFunctionDeclaration1_es6.ts]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    return (_foo = _async_to_generator(function*() {})).apply(this, arguments);
}
