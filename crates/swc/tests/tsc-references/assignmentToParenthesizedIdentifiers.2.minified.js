//// [assignmentToParenthesizedIdentifiers.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function fn() {}
function fn2(x, y) {
    y.t = 3, y.t = 3, y.t = "", y.t = "", y.t = 3, y.t = 3, y.t = 3, y.t = "", y.t = "", y.t = "";
}
x = 3 = 3, x = "" = "", function(M) {
    var y;
    M.y = y;
}(M || (M = {})), M.y = 3, M.y = 3, M.y = 3, M.y = "", M.y = "", M.y = "", M = {
    y: 3
} = {
    y: 3
}, function(M2) {
    var x;
    (M2.M3 || (M2.M3 = {})).x = x;
}(M2 || (M2 = {})), M2.M3 = {
    x: 3
}, M2.M3 = {
    x: 3
}, M2.M3 = {
    x: 3
}, M2.M3 = {
    x: ""
}, M2.M3 = {
    x: ""
}, M2.M3 = {
    x: ""
}, fn = function() {
    return 3;
} = function() {
    return 3;
}, function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), E = void 0 = void 0;
var x, M, M2, E, C = function C() {
    "use strict";
    _class_call_check(this, C);
};
C = void 0 = void 0;
