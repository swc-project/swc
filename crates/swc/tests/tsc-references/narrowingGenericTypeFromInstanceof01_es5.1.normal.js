import * as swcHelpers from "@swc/helpers";
var A = function A(a) {
    "use strict";
    swcHelpers.classCallCheck(this, A);
    this.a = a;
};
var B = function B() {
    "use strict";
    swcHelpers.classCallCheck(this, B);
};
function acceptA(a) {}
function acceptB(b) {}
function test(x) {
    if (swcHelpers._instanceof(x, B)) {
        acceptA(x);
    }
    if (swcHelpers._instanceof(x, A)) {
        acceptA(x);
    }
    if (swcHelpers._instanceof(x, B)) {
        acceptB(x);
    }
    if (swcHelpers._instanceof(x, B)) {
        acceptB(x);
    }
}
