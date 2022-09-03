//// [asyncFunctionDeclaration1_es5.ts]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    return (_foo = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2
            ];
        });
    })).apply(this, arguments);
}
