import * as swcHelpers from "@swc/helpers";
// @target: es5
function foo() {
    var obj = swcHelpers.defineProperty({}, this.bar, 0);
}
