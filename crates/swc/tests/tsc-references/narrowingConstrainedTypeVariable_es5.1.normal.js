import * as swcHelpers from "@swc/helpers";
var C = function C() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
};
function f1(v) {
    if (swcHelpers._instanceof(v, C)) {
        var x = v;
    } else {
        var s = v;
    }
}
var D = function D() {
    "use strict";
    swcHelpers.classCallCheck(this, D);
};
function f2(v) {
    if (swcHelpers._instanceof(v, C)) {
        var x = v;
    } else {
        var y = v;
    }
}
var E = function E() {
    "use strict";
    swcHelpers.classCallCheck(this, E);
};
function f3(v) {
    if (swcHelpers._instanceof(v, E)) {
        var x = v;
    } else {
        var y = v;
    }
}
