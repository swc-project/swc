var tmp = {
    [this.bar()]: 1
}[0];
// @target: es6
class C {
    bar() {
        return 0;
    }
    [tmp]() {
    }
}
