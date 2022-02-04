var ja, da;
(function() {
    this.y = 2;
}).Inner = function I() {
    "use strict";
    (function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    })(this, I), this.x = 1;
}, ja.y, da.x;
