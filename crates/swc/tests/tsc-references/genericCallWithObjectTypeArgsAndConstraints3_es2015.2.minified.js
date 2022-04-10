class Base {
}
class Derived extends Base {
}
class Derived2 extends Base {
}
function f3(y, x) {
    return y(null);
}
new Derived(), new Derived2(), new Derived(), new Derived2(), f3((x)=>x
, new Base()), f3((x)=>x
, new Derived()), f3((x)=>x
, null);
