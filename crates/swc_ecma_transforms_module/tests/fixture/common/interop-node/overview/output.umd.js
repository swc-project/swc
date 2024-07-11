(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("foo"), require("foo-bar"), require("./directory/foo-bar"), require("foo2"), require("foo4"), require("foo5"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "foo",
        "foo-bar",
        "./directory/foo-bar",
        "foo2",
        "foo4",
        "foo5"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.foo, global.fooBar, global.fooBar, global.foo2, global.foo4, global.foo5);
})(this, function(exports, _foo, _foobar, _foobar1, _foo2, _foo4, _foo5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
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
    _foo2 = _foo2;
    var test;
    var test2 = 5;
    _foo4.bar;
    _foo5.foo;
    _foo2;
});
