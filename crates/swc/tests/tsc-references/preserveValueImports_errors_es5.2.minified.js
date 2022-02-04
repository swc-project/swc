import { A } from "./a";
import { BB } from "./d";
var B = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, B);
};
export { A as AA } from "./a";
export { B as BB } from "./b";
export { B as BB };
