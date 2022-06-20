define([
    "require",
    "exports"
], function(require, exports) {
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
    var Foo;
    (function(Foo) {
        var Bar = Foo.Bar = 1234;
    })(Foo || (Foo = {}));
});
