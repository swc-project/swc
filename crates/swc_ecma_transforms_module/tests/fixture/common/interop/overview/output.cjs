"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function __export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
__export(exports, {
    test: ()=>test,
    test2: ()=>test2
});
require("foo");
require("foo-bar");
require("./directory/foo-bar");
var _foo2 = _interopRequireDefault(require("foo2"));
var _foo3 = _interopRequireWildcard(require("foo3"));
var _foo4 = require("foo4");
var _foo5 = require("foo5");
var test;
var test2 = 5;
_foo4.bar;
_foo5.foo;
_foo2.default;
