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
        return Foo.Bar * 2;
    }
    var Foo;
    _exports.Foo = Foo;
    (function(Foo) {
        var Bar = Foo.Bar = 1234;
    })(Foo || (_exports.Foo = Foo = {}));
});
