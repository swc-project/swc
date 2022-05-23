class Base {
}
class Derived extends Base {
}
function f(x) {}
f({
    foo: new Base(),
    bar: new Derived()
}), f({
    foo: new Derived(),
    bar: new Derived()
}), function(x, y) {
    y(null);
}(new Base(), (x)=>x), function(x, y) {
    y(null);
}(new Derived(), (x)=>x), (null)(null), function(x, y) {
    y(null);
}(null, (x)=>x);
