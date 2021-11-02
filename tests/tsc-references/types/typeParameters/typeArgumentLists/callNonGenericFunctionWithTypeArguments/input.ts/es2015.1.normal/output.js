// it is always illegal to provide type arguments to a non-generic function
// all invocations here are illegal
function f(x) {
    return null;
}
var r = f(1);
var f2 = (x)=>{
    return null;
};
var r2 = f2(1);
var f3;
var r3 = f3(1);
class C {
    f(x) {
        return null;
    }
}
var r4 = new C().f(1);
var i;
var r5 = i.f(1);
class C2 {
    f(x1) {
        return null;
    }
}
var r6 = new C2().f(1);
var i2;
var r7 = i2.f(1);
var a;
var r8 = a();
var a2;
var r8 = a2();
