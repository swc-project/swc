define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
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
        boo: function() {
            return boo;
        }
    });
    function boo() {
        return Foo.Bar * 2;
    }
    (function(Foo) {
        Foo.Bar = 1234;
    })(Foo || (Foo = {}));
    var Foo;
});
