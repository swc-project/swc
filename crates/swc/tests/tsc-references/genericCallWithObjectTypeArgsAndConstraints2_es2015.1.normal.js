// Generic call with constraints infering type parameter from object member properties
// No errors expected
class Base {
}
class Derived extends Base {
}
function f(x) {
    var r1;
    return r1;
}
var r = f({
    foo: new Base(),
    bar: new Derived()
});
var r2 = f({
    foo: new Derived(),
    bar: new Derived()
});
function f2(x) {
    var r8;
    return r8;
}
var i;
var r3 = f2(i);
function f3(x, y) {
    return y(null);
}
var r4 = f3(new Base(), (x)=>x);
var r5 = f3(new Derived(), (x)=>x);
var r6 = f3(null, null); // any
var r7 = f3(null, (x)=>x); // any
