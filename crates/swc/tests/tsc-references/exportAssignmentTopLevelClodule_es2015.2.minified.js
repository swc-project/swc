class Foo {
    constructor(){
        this.test = "test";
    }
}
(Foo || (Foo = {
})).answer = 42, module.exports = Foo;
const foo = require("./foo_0");
42 === foo.answer && new foo();
export { };
