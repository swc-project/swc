define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: Object.getOwnPropertyDescriptor(all, name).get
        });
    }
    _export(exports, {
        get Foo () {
            return Foo;
        },
        get boo () {
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
