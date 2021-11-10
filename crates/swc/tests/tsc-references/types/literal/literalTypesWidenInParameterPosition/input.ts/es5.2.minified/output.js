var D = function(param) {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, D), this.widen = void 0 === param ? 2 : param, this.noWiden = 1, this.noWiden = 5, this.widen = 6;
};
new D(7); // ok
