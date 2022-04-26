"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Foo;
var swcHelpers = require("@swc/helpers");
var _react = swcHelpers.interopRequireDefault(require("react"));
function Foo() {
    return call(async (e)=>{
        await doSomething();
    });
}
Foo.displayName = "Foo";
