class A {
    // this is weird I know
    [(() => this)()] = 123;
}
class B {
    // this is weird too I know
    [(() => this)()]() {}
}
class C {
    static [(() => this)()] = 1;
}
class D {
    static d = class {
        [(() => this)()]() {}
    };
}
