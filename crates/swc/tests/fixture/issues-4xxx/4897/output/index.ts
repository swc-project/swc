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
