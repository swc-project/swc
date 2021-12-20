var tmp = "hello", tmp1 = "goodbye";
// @target: es6
// @sourceMap: true
class C {
    [tmp]() {
        debugger;
    }
    get [tmp1]() {
        return 0;
    }
}
