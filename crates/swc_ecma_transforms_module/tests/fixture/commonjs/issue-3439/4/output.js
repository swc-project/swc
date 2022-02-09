"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = foo;
exports.bar = void 0;
function foo() {}
exports.bar = foo;
exports.bar = exports.default = foo = 1;
exports.bar = exports.default = foo = 2;
