//// [computedPropertyNames21_ES6.ts]
class C {
    bar() {
        return 0;
    }
    [this.bar()]() {}
}
