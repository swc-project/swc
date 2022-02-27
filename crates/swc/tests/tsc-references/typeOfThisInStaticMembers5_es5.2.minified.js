var C = function(foo) {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, C), this.foo = foo;
};
C.create = function() {
    return new C("yep");
};
