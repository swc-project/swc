var i;
class Base {
}
class Derived extends Base {
}
class Derived2 extends Base {
}
function f(a) {
    return [
        a.x,
        a.y
    ];
}
function f2(a) {
    return (x)=>a.y;
}
f({
    x: new Derived(),
    y: new Derived2()
}), f({
    x: new Base(),
    y: new Derived2()
}), f2({
    x: new Derived(),
    y: new Derived2()
}), f2(i);
