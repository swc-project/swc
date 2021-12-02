function foo() {
}
class C {
    static foo() {
    }
}
var E;
(function(E1) {
    E1[E1["a"] = 0] = "a";
    E1[E1["b"] = 1] = "b";
    E1[E1["c"] = 2] = "c";
})(E || (E = {
}));
var M;
(function(M1) {
    var a1;
    M1.a = a1;
})(M || (M = {
}));
var a;
var b;
var c;
var d;
var e;
// any as left operand, result is type Any except plusing string
var r1 = a + a;
var r2 = a + b;
var r3 = a + c;
var r4 = a + d;
var r5 = a + e;
// any as right operand, result is type Any except plusing string
var r6 = b + a;
var r7 = c + a;
var r8 = d + a;
var r9 = e + a;
// other cases
var r10 = a + foo;
var r11 = a + foo();
var r12 = a + C;
var r13 = a + new C();
var r14 = a + E;
var r15 = a + E.a;
var r16 = a + M;
var r17 = a + '';
var r18 = a + 123;
var r19 = a + {
    a: ''
};
var r20 = a + ((a2)=>{
    return a2;
});
