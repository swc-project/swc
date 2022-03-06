import * as swcHelpers from "@swc/helpers";
function foo(x) {}
foo({}), foo({});
var C = function(x) {
    "use strict";
    swcHelpers.classCallCheck(this, C), this.x = x;
};
function foo2(x) {}
new C({}), foo2({}), foo2({});
var C2 = function(x) {
    "use strict";
    swcHelpers.classCallCheck(this, C2), this.x = x;
};
new C2({});
