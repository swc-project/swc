//// [computedPropertyNames18_ES6.ts]
function foo() {
    var obj = {
        [this.bar]: 0
    };
}
