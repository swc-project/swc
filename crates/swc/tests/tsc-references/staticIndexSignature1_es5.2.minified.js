var C = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, C);
};
C.foo = 1, C.bar = 2, C.foo, C[42] = 42, C[2] = 2, C[42];
