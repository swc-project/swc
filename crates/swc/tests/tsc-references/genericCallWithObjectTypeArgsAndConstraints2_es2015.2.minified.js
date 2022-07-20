class Base {
}
class Derived extends Base {
}
function f(x) {}
function f3(x, y) {
    return y(null);
}
f({
    foo: new Base(),
    bar: new Derived()
}), f({
    foo: new Derived(),
    bar: new Derived()
}), f3(new Base(), (x)=>x), f3(new Derived(), (x)=>x), f3(null, null), f3(null, (x)=>x);
