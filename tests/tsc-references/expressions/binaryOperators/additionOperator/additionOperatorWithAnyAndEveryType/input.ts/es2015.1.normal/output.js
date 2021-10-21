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
var e;
// any as left operand, result is type Any except plusing string
var r1 = a1 + a1;
var r2 = a1 + b;
var r3 = a1 + c;
var r4 = a1 + d;
var r5 = a1 + e;
// any as right operand, result is type Any except plusing string
var r6 = b + a1;
var r7 = c + a1;
var r8 = d + a1;
var r9 = e + a1;
// other cases
var r10 = a1 + foo;
var r11 = a1 + foo();
var r12 = a1 + C;
var r13 = a1 + new C();
var r14 = a1 + E1;
var r15 = a1 + E1.a;
var r16 = a1 + M1;
var r17 = a1 + '';
var r18 = a1 + 123;
var r19 = a1 + {
    a: ''
};
var r20 = a1 + ((a)=>{
    return a;
});
