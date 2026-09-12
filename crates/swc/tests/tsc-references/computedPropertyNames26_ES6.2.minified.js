//// [computedPropertyNames26_ES6.ts]
class Base {
    bar() {
        return 0;
    }
}
let _ = {
    [super.bar()]: 1
}[0];
class C extends Base {
    [_]() {}
}
