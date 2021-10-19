// @target: es5
function foo() {
    return '';
}
var tmp = foo();
class C {
    bar() {
        return 0;
    }
    [tmp]() {
    }
}
