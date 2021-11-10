// @target: es5
function foo() {
    return '';
}
class C {
    bar() {
        var obj = {
            [foo()] () {
            }
        };
        return 0;
    }
}
