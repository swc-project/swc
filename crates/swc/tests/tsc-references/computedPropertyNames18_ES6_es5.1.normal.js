import * as swcHelpers from "@swc/helpers";
// @target: es6
function foo() {
    var obj = swcHelpers.defineProperty({}, this.bar, 0);
}
