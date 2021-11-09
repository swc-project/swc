// checking whether other types are subtypes of type parameters with constraints
class Foo {
}
function f(t, u, v) {
    // ok
    var r = true ? t : u;
    var r = true ? u : t;
    // ok
    var r2 = true ? t : v;
    var r2 = true ? v : t;
    // ok
    var r3 = true ? v : u;
    var r3 = true ? u : v;
    // ok
    var r4 = true ? t : new Foo();
    var r4 = true ? new Foo() : t;
    // ok
    var r5 = true ? u : new Foo();
    var r5 = true ? new Foo() : u;
    // ok
    var r6 = true ? v : new Foo();
    var r6 = true ? new Foo() : v;
}
class B1 {
}
class D1 extends B1 {
}
class D2 extends B1 {
}
class D3 extends B1 {
}
class D4 extends B1 {
}
class D5 extends B1 {
}
class D6 extends B1 {
}
class D7 extends B1 {
}
class D8 extends B1 {
}
class D9 extends B1 {
}
