// satisfaction of a constraint to Function, all of these invocations are errors unless otherwise noted
function foo(x) {
    return x;
}
foo(1);
foo(()=>{}, 1);
foo(1, ()=>{});
function foo2(x) {
    return x;
}
class C {
}
var b;
class C2 {
}
var b2;
var r = foo2(new Function());
var r2 = foo2((x)=>x);
var r6 = foo2(C);
var r7 = foo2(b);
var r8 = foo2((x)=>x); // no error expected
var r11 = foo2((x, y)=>x);
var r13 = foo2(C2);
var r14 = foo2(b2);
var f2;
var r16 = foo2(f2);
function fff(x, y) {
    foo2(x);
    foo2(y);
}
