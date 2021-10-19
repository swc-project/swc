// @target: es6
function foo() {
    return '';
}
class C {
    static bar() {
        var obj = {
            [foo()] () {
            }
        };
        return 0;
    }
}
