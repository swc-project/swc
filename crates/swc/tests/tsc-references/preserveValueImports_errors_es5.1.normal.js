function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
import { A } from "./a";
// @Filename: e.ts
import { BB } from "./d";
var B = function B() {
    "use strict";
    _classCallCheck(this, B);
};
// @Filename: d.ts
export { A as AA } from "./a";
export { B as BB } from "./b";
export { B as BB };
