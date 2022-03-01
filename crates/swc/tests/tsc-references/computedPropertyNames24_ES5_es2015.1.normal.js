// @target: es5
class Base {
    bar() {
        return 0;
    }
}
let tmp = super.bar();
class C extends Base {
    [tmp]() {}
}
