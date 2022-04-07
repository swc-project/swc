// String indexer providing a constraint of a user defined type
class A {
    foo() {
        return '';
    }
}
class B extends A {
    bar() {
        return '';
    }
}
class Foo {
}
var a;
// error
var b = {
    1.0: new A(),
    2.0: new B(),
    "2.5": new B(),
    3.0: 1,
    "4.0": ''
};
