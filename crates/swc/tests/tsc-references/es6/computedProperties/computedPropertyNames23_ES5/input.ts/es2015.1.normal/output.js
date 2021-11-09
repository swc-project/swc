var tmp = {
    [this.bar()]: 1
}[0];
// @target: es5
class C {
    bar() {
        return 0;
    }
    [tmp]() {
    }
}
