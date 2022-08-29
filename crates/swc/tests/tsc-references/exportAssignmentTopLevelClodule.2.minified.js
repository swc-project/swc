//// [foo_0.ts]
define([
    "require",
    "@swc/helpers/src/_class_call_check.mjs"
], function(require, _classCallCheck) {
    "use strict";
    _classCallCheck = _classCallCheck.default;
    var Foo = function Foo() {
        "use strict";
        _classCallCheck(this, Foo), this.test = "test";
    };
    return (Foo || (Foo = {})).answer = 42, Foo;
});
//// [foo_1.ts]
define([
    "require",
    "exports",
    "./foo_0"
], function(require, exports, _foo0) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), 42 === _foo0.answer && new _foo0();
});
