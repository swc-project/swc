//// [computedPropertyNames24_ES6.ts]
class Base {
    bar() {
        return 0;
    }
}
let _super_bar = super.bar();
class C extends Base {
    [_super_bar]() {}
}
