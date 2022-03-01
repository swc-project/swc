let _foo = foo;
// @target: es6
class C {
    *[_foo]() {}
}
