//// [computedPropertyNames32_ES6.ts]
function foo() {
    return '';
}
class C {
    bar() {
        return 0;
    }
    [foo()]() {}
}
