import * as swcHelpers from "@swc/helpers";
//@target: ES6
var obj = swcHelpers.defineProperty({}, Symbol.for, 0);
obj[Symbol.for];
