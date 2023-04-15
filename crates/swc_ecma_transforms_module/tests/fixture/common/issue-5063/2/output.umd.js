(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports);
    else if (typeof define === "function" && define.amd) define([
        "exports"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {});
})(this, function(exports) {
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
        Foo: function() {
            return Foo;
        },
        foo: function() {
            return foo;
        },
        default: function() {
            return _default;
        }
    });
    class Foo {
        [void 0] = this;
        [void 0](a, b = this.x) {
            return a + b;
        }
        static [void 0] = this;
        static [void 0](a, b = this.x) {
            return a + b;
        }
    }
    function foo(a = this) {
        console.log(a);
    }
    const _default = {
        [void 0]: void 0,
        [void 0] (a, b = this.x) {
            return a + b;
        },
        [void 0]: function(a, b = this.x) {
            return a + b;
        }
    };
});
