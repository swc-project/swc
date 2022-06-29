define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            get: all[name],
            enumerable: true
        });
    }
    _export(exports, {
        Foo: ()=>Foo,
        bar: ()=>bar,
        default: ()=>_default,
        foo: ()=>foo
    });
    class Foo {
        bar = 5;
        getThing(a, b = this.bar) {
            return a + b;
        }
        static baz = 6;
        static foo(a, b = this.baz) {
            return a + b;
        }
    }
    function foo(a = this) {
        console.log(a);
    }
    const bar = {
        [void 0]: foo,
        bar (x = this) {}
    };
    var _default = {
        [void 0] () {
            return this;
        }
    };
});
