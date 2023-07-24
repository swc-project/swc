//// [a.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "default", {
        enumerable: !0,
        get: function() {
            return Foo;
        }
    });
    class Foo {
    }
});
//// [b.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    function foo() {}
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "default", {
        enumerable: !0,
        get: function() {
            return foo;
        }
    });
});
