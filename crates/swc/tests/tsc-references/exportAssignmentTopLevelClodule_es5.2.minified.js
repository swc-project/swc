import * as swcHelpers from "@swc/helpers";
var Foo = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo), this.test = "test";
};
(Foo || (Foo = {})).answer = 42, module.exports = Foo;
var foo = require("./foo_0");
42 === foo.answer && new foo();
