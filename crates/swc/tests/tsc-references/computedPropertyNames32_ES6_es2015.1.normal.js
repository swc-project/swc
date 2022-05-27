// @target: es6
function foo() {
    return '';
}
class C {
    bar() {
        return 0;
    }
    [foo()]() {}
}
