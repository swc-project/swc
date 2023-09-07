//// [exportCodeGen.ts]
// should replace all refs to 'x' in the body,
// with fully qualified
var A, B, C, D, E, F, A1, x, E1, Color, M, x1, Color1, M1, Color2;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
A1 = A || (A = {}), x = 12, Object.defineProperty(A1, "x", {
    enumerable: !0,
    get: function() {
        return x;
    },
    set: function(v) {
        x = v;
    }
}), B || (B = {}), C || (C = {}), (D || (D = {})).yes = function() {
    return !0;
}, (Color = (E1 = E || (E = {})).Color || (E1.Color = {}))[Color.Red = 0] = "Red", E1.fn = function() {}, E1.C = function C() {
    _class_call_check(this, C);
}, M = E1.M || (E1.M = {}), x1 = 42, Object.defineProperty(M, "x", {
    enumerable: !0,
    get: function() {
        return x1;
    },
    set: function(v) {
        x1 = v;
    }
}), F || (F = {}), (Color2 = Color1 || (Color1 = {}))[Color2.Red = 0] = "Red", M1 || (M1 = {});
