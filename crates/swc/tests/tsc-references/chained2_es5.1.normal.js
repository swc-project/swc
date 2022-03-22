import * as swcHelpers from "@swc/helpers";
// @Filename: /c.ts
import * as types from "./b";
// @Filename: /d.ts
import types from "./c";
// @Filename: /a.ts
var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
};
export { A };
export { types as default };
new types.A();
new types.B();
var a = {};
var b = {};
