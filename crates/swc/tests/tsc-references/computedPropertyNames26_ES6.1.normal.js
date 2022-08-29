//// [computedPropertyNames26_ES6.ts]
class Base {
    bar() {
        return 0;
    }
}
let tmp = {
    [super.bar()]: 1
}[0];
class C extends Base {
    // Gets emitted as super, not _super, which is consistent with
    // use of super in static properties initializers.
    [tmp]() {}
}
