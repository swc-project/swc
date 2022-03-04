var _Foo;
(_Foo = function Foo() {
    "use strict";
    (function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    })(this, Foo);
}).prop = 1, console.log(_Foo.prop), _Foo.prop++, console.log(_Foo.prop), _Foo.prop++, console.log(_Foo.prop), _Foo.prop++;
