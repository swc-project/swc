"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.test2 = exports.test = void 0;
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    test: ()=>test,
    test2: ()=>test2
});
require("foo");
require("foo-bar");
require("./directory/foo-bar");
const _foo2 = require("foo2");
const _foo3 = _interopRequireWildcard(require("foo3"), true);
const _foo4 = require("foo4");
const _foo5 = require("foo5");
var test;
var test2 = 5;
_foo4.bar;
_foo5.foo;
_foo2;
