//// [asyncAliasReturnType_es6.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
function f() {
    return _f.apply(this, arguments);
}
function _f() {
    _f = _async_to_generator(function*() {});
    return _f.apply(this, arguments);
}
