"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.foobar = exports.bazbar = exports.baz = exports.bar = exports.foo = void 0;
let foo = 1n;
exports.foo = foo;
foo++, exports.foo = foo;
let bar = exports.foo = ++foo;
exports.bar = bar;
let baz = (bar--, exports.bar = bar);
exports.baz = baz;
exports.bar = --bar;
exports.bazbar = baz;
exports.foobar = foo;
