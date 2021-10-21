var tmp = "computedName1", tmp1 = "computedName2", tmp2 = "computedName3", tmp3 = "computedname4", tmp4 = "computedname5", tmp5 = "computedname6";
// @target:es6
class D {
    foo() {
    }
    [tmp]() {
    }
    [tmp1](a) {
    }
    [tmp2](a1) {
        return 1;
    }
    bar() {
        return this._bar;
    }
    baz(a2, x) {
        return "HELLO";
    }
    static [tmp3]() {
    }
    static [tmp4](a3) {
    }
    static [tmp5](a4) {
        return true;
    }
    static staticMethod() {
        var x = 1 + 2;
        return x;
    }
    static foo(a5) {
    }
    static bar(a6) {
        return 1;
    }
}
