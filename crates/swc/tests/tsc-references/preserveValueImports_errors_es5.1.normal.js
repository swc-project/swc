import * as swcHelpers from "@swc/helpers";
import { A } from "./a";
// @Filename: e.ts
import { BB } from "./d";
// @Filename: b.ts
var B = function B() {
    "use strict";
    swcHelpers.classCallCheck(this, B);
};
// @Filename: d.ts
export { A as AA } from "./a";
export { B as BB } from "./b";
export { B as BB };
