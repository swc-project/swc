class A {
    static #foo = 1;
    static { Object.freeze(this); }
}
