define([
    "require",
    "exports"
], function(require, _exports) {
    "use strict";
    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    _exports.boo = boo;
    _exports.Foo = void 0;
    function boo() {
        return Foo1.Bar * 2;
    }
    var Foo1;
    _exports.Foo = Foo1;
    (function(Foo) {
        var Bar = Foo.Bar = 1234;
    })(Foo1 || (_exports.Foo = Foo1 = {}));
});
