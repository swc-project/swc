// @target: es6
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
