//// [destructuringParameterDeclaration7ES5.ts]
import { _ as _object_destructuring_empty } from "@swc/helpers/_/_object_destructuring_empty";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
function foo(param, param1) {
    var ref = _object_destructuring_empty(param), foo = param1.foo, bar = param1.bar;
}
function baz(param, param1) {
    var _param = _sliced_to_array(param, 0), foo = param1.foo, bar = param1.bar;
}
function one(param, param1) {
    var _param = _sliced_to_array(param, 0), ref = _object_destructuring_empty(param1);
}
function two(param, param1) {
    var _param = _sliced_to_array(param, 0), _param1 = _sliced_to_array(param1, 3), a = _param1[0], b = _param1[1], c = _param1[2];
}
