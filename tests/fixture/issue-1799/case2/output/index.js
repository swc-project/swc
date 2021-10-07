"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Foo;
var swcHelpers = require("@swc/helpers");
var _react = swcHelpers.interopRequireDefault(require("react"));
function Foo() {
    return(/*#__PURE__*/ React.createElement("div", {
        onClick: swcHelpers.asyncToGenerator(function*(e) {
            yield doSomething();
        })
    }));
}
Foo.displayName = "Foo";
