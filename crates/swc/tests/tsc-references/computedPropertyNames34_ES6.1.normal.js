//// [computedPropertyNames34_ES6.ts]
function foo() {
    return '';
}
class C {
    static bar() {
        var obj = {
            [foo()] () {}
        };
        return 0;
    }
}
