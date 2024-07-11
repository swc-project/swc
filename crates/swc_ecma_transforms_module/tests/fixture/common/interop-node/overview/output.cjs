"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    test: null,
    test2: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    test: function() {
        return test;
    },
    test2: function() {
        return test2;
    }
});
require("foo");
require("foo-bar");
require("./directory/foo-bar");
const _foo2 = require("foo2");
const _foo4 = require("foo4");
const _foo5 = require("foo5");
var test;
var test2 = 5;
_foo4.bar;
_foo5.foo;
_foo2;
