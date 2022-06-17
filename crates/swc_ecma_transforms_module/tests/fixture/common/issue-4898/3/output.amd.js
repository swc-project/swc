define([
    "require",
    "assert"
], function(require, _assert) {
    "use strict";
    _assert(true);
    var Foo;
    (function(Foo) {
        var Baz = Foo.Baz = 42;
    })(Foo || (Foo = {}));
    var Bar = Foo;
    console.log(Bar.Baz);
});
