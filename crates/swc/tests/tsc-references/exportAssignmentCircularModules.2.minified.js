//// [foo_0.ts]
define([
    "require",
    "./foo_1"
], function(require, _foo_1) {
    var Foo, Foo1, x;
    return Foo1 = Foo || (Foo = {}), x = _foo_1.x, Object.defineProperty(Foo1, "x", {
        enumerable: !0,
        get: function() {
            return x;
        },
        set: function(v) {
            x = v;
        }
    }), Foo;
});
//// [foo_1.ts]
define([
    "require",
    "./foo_2"
], function(require, _foo_2) {
    var Foo, Foo1, x;
    return Foo1 = Foo || (Foo = {}), x = _foo_2.x, Object.defineProperty(Foo1, "x", {
        enumerable: !0,
        get: function() {
            return x;
        },
        set: function(v) {
            x = v;
        }
    }), Foo;
});
//// [foo_2.ts]
define([
    "require",
    "./foo_0"
], function(require, _foo_0) {
    var Foo, Foo1, x;
    return Foo1 = Foo || (Foo = {}), x = _foo_0.x, Object.defineProperty(Foo1, "x", {
        enumerable: !0,
        get: function() {
            return x;
        },
        set: function(v) {
            x = v;
        }
    }), Foo;
});
