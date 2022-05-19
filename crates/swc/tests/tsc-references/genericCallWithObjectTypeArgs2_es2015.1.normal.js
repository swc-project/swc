class Base {
}
class Derived extends Base {
}
class Derived2 extends Base {
}
// returns {}[]
function f(a) {
    return [
        a.x,
        a.y
    ];
}
var r = f({
    x: new Derived(),
    y: new Derived2()
}); // {}[]
var r2 = f({
    x: new Base(),
    y: new Derived2()
}); // {}[]
function f2(a) {
    return (x)=>a.y;
}
var r3 = f2({
    x: new Derived(),
    y: new Derived2()
}); // Derived => Derived2
var i;
var r4 = f2(i); // Base => Derived
