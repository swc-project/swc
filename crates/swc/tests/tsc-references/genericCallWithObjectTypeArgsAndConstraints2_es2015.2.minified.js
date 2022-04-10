class Base {
}
class Derived extends Base {
}
function f3(x, y) {
    return y(null);
}
new Base(), new Derived(), new Derived(), new Derived(), f3(new Base(), (x)=>x
), f3(new Derived(), (x)=>x
), f3(null, null), f3(null, (x)=>x
);
