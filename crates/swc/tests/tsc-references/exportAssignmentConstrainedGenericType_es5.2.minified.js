import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Foo = function(x) {
    "use strict";
    _class_call_check(this, Foo);
};
module.exports = Foo;
var foo = require("./foo_0");
new foo(!0), new foo({
    a: "test",
    b: 42
}).test.b;
