//// [subtypingWithCallSignatures2.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
foo1(function(x) {
    return [
        x
    ];
}), foo2(function(x) {
    return [
        ''
    ];
}), foo3(function(x) {
    return x;
}), foo4(function(x, y) {
    return x;
}), foo5(function(x) {
    return null;
}), foo6(function(x) {
    return null;
}), foo7(function(x) {
    return function(r) {
        return null;
    };
}), foo8(function(x, y) {
    return function(r) {
        return null;
    };
}), foo9(function(x, y) {
    return function(r) {
        return null;
    };
}), foo10(function() {
    for(var _len = arguments.length, x = Array(_len), _key = 0; _key < _len; _key++)x[_key] = arguments[_key];
    return x[0];
}), foo11(function(x, y) {
    return x;
}), foo12(function(x, y) {
    return null;
}), foo13(function(x, y) {
    return y;
}), foo14(function(x) {
    return x.a;
}), foo15(function(x) {
    return null;
}), foo16(function(x) {
    return [
        1
    ];
}), foo17(function(x) {
    return null;
}), foo18(function(x) {
    return null;
});
