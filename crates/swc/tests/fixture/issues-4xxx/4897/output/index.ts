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
        Foo: ()=>Foo,
        boo: ()=>boo
    });
    function boo() {
        return Foo.Bar * 2;
    }
    var Foo;
    (function(Foo) {
        var Bar = Foo.Bar = 1234;
    })(Foo || (Foo = {}));
});
