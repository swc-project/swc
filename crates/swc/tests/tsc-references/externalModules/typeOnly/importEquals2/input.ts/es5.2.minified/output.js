import * as a from "./a";
var A = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, A);
};
module.exports = a;
var a = require("./b");
new a.A(); // Error
