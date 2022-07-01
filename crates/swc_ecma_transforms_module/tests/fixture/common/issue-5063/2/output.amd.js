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
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
        Foo: ()=>Foo,
        default: ()=>_default,
        foo: ()=>foo
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
    var _default = {
        [void 0]: void 0,
        [void 0] (a, b = this.x) {
            return a + b;
        },
        [void 0]: function(a, b = this.x) {
            return a + b;
        }
    };
});
