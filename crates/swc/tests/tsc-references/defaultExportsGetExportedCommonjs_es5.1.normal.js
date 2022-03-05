import * as swcHelpers from "@swc/helpers";
var Foo = function Foo() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
};
export { Foo as default };
// @filename: b.ts
export default function foo() {};
