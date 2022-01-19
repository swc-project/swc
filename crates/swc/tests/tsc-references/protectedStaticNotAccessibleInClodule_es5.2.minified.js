var C = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, C);
};
!function(C1) {
    C1.f = C.foo, C1.b = C.bar;
}(C || (C = {}));
