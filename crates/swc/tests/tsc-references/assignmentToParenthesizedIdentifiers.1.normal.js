//// [assignmentToParenthesizedIdentifiers.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var x;
x = 3; // OK
x = 3; // OK
x = ''; // Error
x = ''; // Error
_$M.y = 3; // OK
_$M.y = 3; // OK
_$M.y = 3; // OK
_$M.y = ''; // Error
_$M.y = ''; // Error
_$M.y = ''; // Error
_$M = {
    y: 3
}; // Error
_$M = {
    y: 3
}; // Error
(function(_$M2) {
    _$M2.M3 = {
        x: 3
    }; // Error
})(_$M2 || (_$M2 = {}));
_$M2.M3 = {
    x: 3
}; // OK
_$M2.M3 = {
    x: 3
}; // OK
_$M2.M3 = {
    x: 3
}; // OK
_$M2.M3 = {
    x: ''
}; // Error
_$M2.M3 = {
    x: ''
}; // Error
_$M2.M3 = {
    x: ''
}; // Error
function fn() {
    var _$M, _$M2;
}
fn = function() {
    return 3;
}; // Bug 823548: Should be error (fn is not a reference)
fn = function() {
    return 3;
}; // Should be error
function fn2(x, y) {
    x = 3;
    x = 3; // OK
    x = ''; // Error
    x = ''; // Error
    y.t = 3; // OK
    y.t = 3; // OK
    y.t = ''; // Error
    y.t = ''; // Error
    y['t'] = 3; // OK
    y['t'] = 3; // OK
    y['t'] = 3; // OK
    y['t'] = ''; // Error
    y['t'] = ''; // Error
    y['t'] = ''; // Error
}
var E = /*#__PURE__*/ function(E) {
    E[E["A"] = 0] = "A";
    return E;
}(E || {});
E = undefined; // Error
E = undefined; // Error
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
C = undefined; // Error
C = undefined; // Error
