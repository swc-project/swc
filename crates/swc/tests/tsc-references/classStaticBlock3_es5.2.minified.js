var C = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, C);
};
console.log(C.f1, C.f2, C.f3), console.log(C.f1, C.f2, C.f3), C.f1 = 1, C.f2 = 2, C.f3 = 3;
