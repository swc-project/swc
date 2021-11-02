// @module: amd
// @Filename: foo_0.ts
class Foo1 {
    constructor(){
        this.test = "test";
    }
}
(function(Foo) {
    Foo.answer = 42;
})(Foo1 || (Foo1 = {
}));
module.exports = Foo1;
// @Filename: foo_1.ts
const foo = require("./foo_0");
if (foo.answer === 42) {
    var x = new foo();
}
export { };
