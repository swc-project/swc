//// [emitClassDeclarationWithMethodInES6.ts]
class D {
    foo() {}
    ["computedName1"]() {}
    ["computedName2"](a) {}
    ["computedName3"](a) {
        return 1;
    }
    bar() {
        return this._bar;
    }
    baz(a, x) {
        return "HELLO";
    }
    static ["computedname4"]() {}
    static ["computedname5"](a) {}
    static ["computedname6"](a) {
        return true;
    }
    static staticMethod() {
        var x = 1 + 2;
        return x;
    }
    static foo(a) {}
    static bar(a) {
        return 1;
    }
}
