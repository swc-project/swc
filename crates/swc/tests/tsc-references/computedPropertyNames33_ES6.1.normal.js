//// [computedPropertyNames33_ES6.ts]
function foo() {
    return '';
}
class C {
    bar() {
        var obj = {
            [foo()] () {}
        };
        return 0;
    }
}
