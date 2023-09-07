//// [TwoInternalModulesThatMergeEachWithExportedModulesOfTheSameName.ts]
var A, X, A1, x, B, x1, X1, Y, X2, Z;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
Object.defineProperty((A1 = A || (A = {})).B || (A1.B = {}), "x", {
    enumerable: !0,
    get: function() {
        return x;
    },
    set: function(v) {
        x = v;
    }
}), A || (A = {}), Object.defineProperty(B || (B = {}), "x", {
    enumerable: !0,
    get: function() {
        return x1;
    },
    set: function(v) {
        x1 = v;
    }
}), A.B.x, ((Y = (X1 = X || (X = {})).Y || (X1.Y = {})).Z || (Y.Z = {})).Line = function Line() {
    _class_call_check(this, Line);
}, (X2 = X || (X = {})).Y || (X2.Y = {}), (Z || (Z = {})).Line = function Line() {
    _class_call_check(this, Line);
};
