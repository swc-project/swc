function foo() {
}
class C {
    static foo() {
    }
}
var E1;
(function(E) {
    E[E["a"] = 0] = "a";
    E[E["b"] = 1] = "b";
    E[E["c"] = 2] = "c";
})(E1 || (E1 = {
}));
var M1;
(function(M) {
    var a;
    M.a = a;
})(M1 || (M1 = {
}));
var a1;
var b;
var c;
var d;
// boolean + every type except any and string
var r1 = a1 + a1;
var r2 = a1 + b;
var r3 = a1 + c;
// number + every type except any and string
var r4 = b + a1;
var r5 = b + b; // number + number is valid
var r6 = b + c;
// object + every type except any and string
var r7 = c + a1;
var r8 = c + b;
var r9 = c + c;
// other cases
var r10 = a1 + true;
var r11 = true + false;
var r12 = true + 123;
var r13 = {
} + {
};
var r14 = b + d;
var r15 = b + foo;
var r16 = b + foo();
var r17 = b + C;
var r18 = E1.a + new C();
var r19 = E1.a + C.foo();
var r20 = E1.a + M1;
