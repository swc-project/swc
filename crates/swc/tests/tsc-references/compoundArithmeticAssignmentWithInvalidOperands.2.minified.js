//// [compoundArithmeticAssignmentWithInvalidOperands.ts]
var E, a, b, x1, x2, x3, x4, x5, x6;
!function(E) {
    E[E.a = 0] = "a", E[E.b = 1] = "b";
}(E || (E = {})), x1 *= a, x1 *= b, x1 *= !0, x1 *= 0, x1 *= "", x1 *= E.a, x1 *= {}, x1 *= null, x1 *= void 0, x2 *= a, x2 *= b, x2 *= !0, x2 *= 0, x2 *= "", x2 *= E.a, x2 *= {}, x2 *= null, x2 *= void 0, x3 *= a, x3 *= b, x3 *= !0, x3 *= 0, x3 *= "", x3 *= E.a, x3 *= {}, x3 *= null, x3 *= void 0, x4 *= a, x4 *= b, x4 *= !0, x4 *= 0, x4 *= "", x4 *= E.a, x4 *= {}, x4 *= null, x4 *= void 0, x5 *= b, x5 *= !0, x5 *= "", x5 *= {}, x6 *= b, x6 *= !0, x6 *= "", x6 *= {};
