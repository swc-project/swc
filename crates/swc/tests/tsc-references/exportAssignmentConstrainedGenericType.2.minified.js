//// [foo_0.ts]
"use strict";
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default, Foo = function Foo(x) {
    "use strict";
    _classCallCheck(this, Foo);
};
module.exports = Foo;
//// [foo_1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var foo = require("./foo_0"), x = new foo(!0), y = new foo({
    a: "test",
    b: 42
}), z = y.test.b;
