"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.bazbar = exports.foobar = exports.baz = exports.bar = exports.foo = void 0;
var ref, ref1;
let foo = 1n;
exports.foo = foo;
ref = foo++, exports.foo = foo, ref;
let bar = exports.foo = ++foo;
exports.bar = bar;
let baz = (ref1 = bar--, exports.bar = bar, ref1);
exports.baz = baz;
exports.bar = --bar;
exports.foobar = foo;
exports.bazbar = baz;
