interface A {
    foo(): this;
}
interface B extends A {
    bar(): this;
}
interface C extends B {
    baz(): this;
}
var c: C;
var z = c.foo().bar().baz();  // Fluent pattern
