class Foo {
    constructor(){
        this.test = "test";
    }
}
(Foo || (Foo = {})).answer = 42;
const foo = require("./foo_0");
42 === foo.answer && new foo(), module.exports = Foo;
