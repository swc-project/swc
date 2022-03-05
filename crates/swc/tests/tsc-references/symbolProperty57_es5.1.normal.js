import * as swcHelpers from "@swc/helpers";
//@target: ES6
var obj = swcHelpers.defineProperty({}, Symbol.iterator, 0);
// Should give type 'any'.
obj[Symbol["nonsense"]];
