var D = function() {
    "use strict";
    var widen = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 2;
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, D), this.widen = widen, this.noWiden = 1, this.noWiden = 5, this.widen = 6;
};
new D(7);
