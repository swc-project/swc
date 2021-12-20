var tmp = this.bar();
// @target: es6
class C {
    bar() {
        return 0;
    }
    [tmp]() {
    }
}
