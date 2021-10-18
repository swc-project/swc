var C = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, C), this.p = 1;
};
C.prototype = {
    q: 2
};
var c = new C();
c.p, c.q;
