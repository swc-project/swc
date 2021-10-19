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
    a: A,
    b: B
};
