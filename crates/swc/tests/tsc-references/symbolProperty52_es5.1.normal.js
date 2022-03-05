import * as swcHelpers from "@swc/helpers";
//@target: ES6
var obj = swcHelpers.defineProperty({}, Symbol.nonsense, 0);
obj = {};
obj[Symbol.nonsense];
