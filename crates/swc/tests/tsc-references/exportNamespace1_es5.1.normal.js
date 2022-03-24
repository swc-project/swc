import * as swcHelpers from "@swc/helpers";
// @Filename: a.ts
export var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
};
// @Filename: c.ts
export * from "./b";
new A(); // Error
