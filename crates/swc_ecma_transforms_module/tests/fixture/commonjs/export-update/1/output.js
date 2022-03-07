"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.baz = exports.bar = exports.foo = void 0;
let foo = 1n;
exports.foo = foo;
foo++, exports.foo = foo;
let bar = (++foo, exports.foo = foo);
exports.bar = bar;
let baz = (bar--, exports.bar = bar);
exports.baz = baz;
--bar, exports.bar = bar;
