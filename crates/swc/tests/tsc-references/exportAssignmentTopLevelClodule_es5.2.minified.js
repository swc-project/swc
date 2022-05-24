import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var Foo = function() {
    "use strict";
    _class_call_check(this, Foo), this.test = "test";
};
(Foo || (Foo = {})).answer = 42, module.exports = Foo;
var foo = require("./foo_0");
42 === foo.answer && new foo();
