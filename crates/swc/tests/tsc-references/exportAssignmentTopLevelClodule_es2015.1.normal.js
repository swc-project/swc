// @module: amd
// @Filename: foo_0.ts
class Foo {
    constructor(){
        this.test = "test";
    }
}
(function(Foo1) {
    var answer = Foo1.answer = 42;
})(Foo || (Foo = {}));
module.exports = Foo;
// @Filename: foo_1.ts
const foo = require("./foo_0");
if (foo.answer === 42) {
    var x = new foo();
}
export { };
