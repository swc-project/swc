//// [asyncFunctionDeclaration14_es5.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2
            ];
        });
    });
    return _foo.apply(this, arguments);
}
