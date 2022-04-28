class Base {
}
class Derived extends Base {
}
class Derived2 extends Base {
}
function f2(a) {}
new Derived(), new Derived2(), f2({
    x: new Derived(),
    y: new Derived2()
}), f2({
    x: new Derived(),
    y: new Derived2()
}), function(y, x) {
    y(null);
}((x)=>x
, new Base()), function(y, x) {
    y(null);
}((x)=>x
, new Derived()), function(y, x) {
    y(null);
}((x)=>x
, null);
