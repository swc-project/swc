export var foo, C1 = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, C1), this.m1 = 42;
};
C1.s1 = !0, require("./foo_0").C1.s1;
