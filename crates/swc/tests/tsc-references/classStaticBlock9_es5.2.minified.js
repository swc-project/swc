var A = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, A);
};
A.foo, A.bar = A.foo + 1, A.foo = 1;
