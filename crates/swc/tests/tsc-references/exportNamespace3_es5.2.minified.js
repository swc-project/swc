import * as _a from "./b";
import { a } from "./c";
export var A = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, A);
};
new a.A(); // Error
export { _a as a };
