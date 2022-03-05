import * as swcHelpers from "@swc/helpers";
import * as _a from './b';
// @Filename: d.ts
import { a } from './c';
// @Filename: a.ts
export var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
};
export { _a as a };
new a.A(); // Error
