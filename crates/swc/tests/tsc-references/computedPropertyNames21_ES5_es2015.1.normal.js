var tmp = this.bar();
// @target: es5
class C {
    bar() {
        return 0;
    }
    [tmp]() {
    }
}
