import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Foo = function() {
    "use strict";
    _class_call_check(this, Foo), this.test = "test";
};
(Foo || (Foo = {})).answer = 42;
var foo = require("./foo_0");
42 === foo.answer && new foo(), module.exports = Foo;
