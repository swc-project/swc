import * as swcHelpers from "@swc/helpers";
// @Filename: /d.ts
import { D } from './c';
// @Filename: /a.ts
var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
};
export { B as C } from './a';
new D();
var d = {};
