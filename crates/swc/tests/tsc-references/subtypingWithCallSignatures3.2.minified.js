//// [subtypingWithCallSignatures3.ts]
// checking subtype relations for function types as it relates to contextual signature instantiation
// error cases, so function calls will all result in 'any'
var Errors, WithGenericSignaturesInBaseType;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
Errors || (Errors = {}), foo2(function(x) {
    return null;
}), foo7(function(x) {
    return function(r) {
        return null;
    };
}), foo8(function(x, y) {
    return function(r) {
        return null;
    };
}), foo10(function() {
    for(var _len = arguments.length, x = Array(_len), _key = 0; _key < _len; _key++)x[_key] = arguments[_key];
    return null;
}), foo11(function(x, y) {
    return null;
}), foo12(function(x, y) {
    return null;
}), foo15(function(x) {
    return null;
}), foo15(function(x) {
    return 1;
}), foo16(function(x) {
    return null;
}), foo17(function(x) {
    return null;
}), WithGenericSignaturesInBaseType || (WithGenericSignaturesInBaseType = {}), foo2(function(x) {
    return [
        ""
    ];
}), foo3(function(x) {
    return null;
});
