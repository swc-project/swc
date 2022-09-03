//// [destructuringParameterDeclaration7ES5iterable.ts]
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _throw from "@swc/helpers/src/_throw.mjs";
function foo(_$param, param) {
    var _$param = null !== _$param ? _$param : _throw(new TypeError("Cannot destructure undefined"));
    param.foo, param.bar;
}
function baz(param, param1) {
    _sliced_to_array(param, 0), param1.foo, param1.bar;
}
function one(param, _$param) {
    _sliced_to_array(param, 0);
    var _$param = null !== _$param ? _$param : _throw(new TypeError("Cannot destructure undefined"));
}
function two(param, param1) {
    _sliced_to_array(param, 0);
    var _param = _sliced_to_array(param1, 3);
    _param[0], _param[1], _param[2];
}
