//// [asyncFunctionDeclaration13_es6.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _async_to_generator(function*() {
        // Legal to use 'await' in a type context.
        var v;
    });
    return _foo.apply(this, arguments);
}
