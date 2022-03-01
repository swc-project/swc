// @target: es5
function foo() {
    return '';
}
let tmp = foo();
class C {
    bar() {
        return 0;
    }
    [tmp]() {}
}
