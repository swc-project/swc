class C {
    static foo = bar;
}
bar;
class D {
    static #_ = this.FOO = {};
}
(class {
    static #_ = this.FOO = {};
});
