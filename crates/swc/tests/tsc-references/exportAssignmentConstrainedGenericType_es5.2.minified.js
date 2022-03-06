import * as swcHelpers from "@swc/helpers";
var Foo = function(x) {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
};
module.exports = Foo;
var foo = require("./foo_0");
new foo(!0), new foo({
    a: "test",
    b: 42
}).test.b;
