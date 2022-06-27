function foo() {
    return "test";
}
(foo || (foo = {})).answer = 42;
const foo = require("./foo_0");
42 === foo.answer && foo(), module.exports = foo;
