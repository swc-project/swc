//// [foo_0.ts]
"use strict";
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default;
var Foo = function Foo() {
    "use strict";
    _classCallCheck(this, Foo);
};
module.exports = Foo;
//// [foo_1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var foo = require("./foo_0");
var x = new foo();
var y = x.test;
