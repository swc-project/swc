//// [subtypingWithCallSignatures2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var r1arg1 = function(x) {
    return [
        x
    ];
};
foo1(r1arg1);
var r2arg1 = function(x) {
    return [
        ""
    ];
};
foo2(r2arg1);
var r3arg1 = function(x) {
    return x;
};
foo3(r3arg1);
var r4arg1 = function(x, y) {
    return x;
};
foo4(r4arg1);
var r5arg1 = function(x) {
    return null;
};
foo5(r5arg1);
var r6arg1 = function(x) {
    return null;
};
foo6(r6arg1);
var r7arg1 = function(x) {
    return function(r) {
        return null;
    };
};
foo7(r7arg1);
var r8arg1 = function(x, y) {
    return function(r) {
        return null;
    };
};
foo8(r8arg1);
var r9arg1 = function(x, y) {
    return function(r) {
        return null;
    };
};
foo9(r9arg1);
var r10arg1 = function() {
    for(var _len = arguments.length, x = Array(_len), _key = 0; _key < _len; _key++)x[_key] = arguments[_key];
    return x[0];
};
foo10(r10arg1);
var r11arg1 = function(x, y) {
    return x;
};
foo11(r11arg1);
var r12arg1 = function(x, y) {
    return null;
};
foo12(r12arg1);
var r13arg1 = function(x, y) {
    return y;
};
foo13(r13arg1);
var r14arg1 = function(x) {
    return x.a;
};
foo14(r14arg1);
var r15arg1 = function(x) {
    return null;
};
foo15(r15arg1);
var r16arg1 = function(x) {
    return [
        1
    ];
};
foo16(r16arg1);
var r17arg1 = function(x) {
    return null;
};
foo17(r17arg1);
var r18arg1 = function(x) {
    return null;
};
foo18(r18arg1);
