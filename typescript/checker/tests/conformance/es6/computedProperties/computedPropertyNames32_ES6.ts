// @target: es6
function foo<T>() { return '' }
class C<T> {
    bar() {
        return 0;
    }
    [foo<T>()]() { }
}