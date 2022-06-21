function foo() {
    return "test";
}
(foo || (foo = {})).answer = 42;
let foo = require("./foo_0");
42 === foo.answer && foo(), module.exports = foo;
export { };
