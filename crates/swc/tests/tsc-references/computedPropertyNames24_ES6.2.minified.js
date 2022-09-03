//// [computedPropertyNames24_ES6.ts]
class Base {
    bar() {
        return 0;
    }
}
let tmp = super.bar();
class C extends Base {
    [tmp]() {}
}
