var Foo = function(param, param1) {
    "use strict";
    var x = void 0 === param ? 12 : param;
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, Foo), this.x = x, this.y = void 0 === param1 ? x : param1;
};
