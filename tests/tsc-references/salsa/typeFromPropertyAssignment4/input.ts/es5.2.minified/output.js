var local, x, Outer = {
};
Outer.Inner = function _class() {
    "use strict";
    (function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    })(this, _class), this.y = 12;
}, local.y, new Outer.Inner().y, x.y, new Outer.Inner().y;
