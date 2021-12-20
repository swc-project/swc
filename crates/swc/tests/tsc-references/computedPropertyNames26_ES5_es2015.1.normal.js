// @target: es5
class Base {
    bar() {
        return 0;
    }
}
var tmp = {
    [super.bar()]: 1
}[0];
class C extends Base {
    [tmp]() {
    }
}
