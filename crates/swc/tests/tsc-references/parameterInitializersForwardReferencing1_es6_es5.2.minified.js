var Foo = function() {
    "use strict";
    var x = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 12, y = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : x;
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, Foo), this.x = x, this.y = y;
};
