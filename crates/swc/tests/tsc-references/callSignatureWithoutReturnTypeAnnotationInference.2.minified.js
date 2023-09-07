//// [callSignatureWithoutReturnTypeAnnotationInference.ts]
// Call signatures without a return type should infer one from the function body (if present)
// Simple types
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _type_of } from "@swc/helpers/_/_type_of";
function m1() {
    return 1;
}
!function foo3() {
    return foo3();
}(), _type_of(1), M = M1 || (M1 = {}), x1 = 1, Object.defineProperty(M, "x", {
    enumerable: !0,
    get: function() {
        return x1;
    },
    set: function(v) {
        x1 = v;
    }
}), M.C = function C() {
    _class_call_check(this, C);
}, m11 = m1 || (m1 = {}), y1 = 2, Object.defineProperty(m11, "y", {
    enumerable: !0,
    get: function() {
        return y1;
    },
    set: function(v) {
        y1 = v;
    }
});
var c1, x, e1, e11, y, M, x1, m11, y1, M1, e12, c11 = function c1(x) {
    _class_call_check(this, c1);
};
c1 = c11 || (c11 = {}), x = 1, Object.defineProperty(c1, "x", {
    enumerable: !0,
    get: function() {
        return x;
    },
    set: function(v) {
        x = v;
    }
}), (e1 = e12 || (e12 = {}))[e1.A = 0] = "A", e11 = e12 || (e12 = {}), y = 1, Object.defineProperty(e11, "y", {
    enumerable: !0,
    get: function() {
        return y;
    },
    set: function(v) {
        y = v;
    }
});
