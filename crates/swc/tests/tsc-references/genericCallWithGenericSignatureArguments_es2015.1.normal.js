// When a function expression is inferentially typed (section 4.9.3) and a type assigned to a parameter in that expression references type parameters for which inferences are being made, 
// the corresponding inferred type arguments to become fixed and no further candidate inferences are made for them.
function foo(a, b) {
    var r;
    return r;
}
//var r1 = foo((x: number) => 1, (x: string) => ''); // error
var r1b = foo((x)=>1, (x)=>''); // {} => {}
var r2 = foo((x)=>null, (x)=>''); // Object => Object
var r3 = foo((x)=>1, (x)=>null); // number => number
var r3ii = foo((x)=>1, (x)=>1); // number => number
var a;
var b;
var r4 = foo((x)=>a, (x)=>b); // typeof a => typeof a
var r5 = foo((x)=>b, (x)=>a); // typeof b => typeof b
function other(x) {
    var r6 = foo((a1)=>a1, (b1)=>b1); // T => T
    var r6b = foo((a2)=>a2, (b2)=>b2); // {} => {}
}
function other2(x) {
    var r7 = foo((a3)=>a3, (b3)=>b3); // T => T
    var r7b = foo((a4)=>a4, (b4)=>b4); // {} => {}
    var r8 = r7(null);
// BUG 835518
//var r9 = r7(new Date());
}
function foo2(a, b) {
    var r;
    return r;
}
function other3(x) {
    var r8 = foo2((a5)=>a5, (b5)=>b5); // Date => Date
}
