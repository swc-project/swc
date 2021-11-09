function foo() {
    return "test";
}
(foo || (foo = {
})).answer = 42, module.exports = foo;
var foo = require("./foo_0");
42 === foo.answer && foo();
export { };
