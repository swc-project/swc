import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
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
