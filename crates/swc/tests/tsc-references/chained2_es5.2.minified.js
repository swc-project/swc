import * as types from "./b";
import types from "./c";
var A = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, A);
};
new types.A(), new types.B();
export { A, types as default };
