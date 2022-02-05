(function() {
    var Foo = function() {
        "use strict";
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, Foo);
    };
    return console.log(Foo.prop), Foo.prop++, console.log(Foo.prop), Foo.prop++, console.log(Foo.prop), Foo.prop++, Foo;
})().prop = 1;
