import * as swcHelpers from "@swc/helpers";
var A = function() {
    swcHelpers.classCallCheck(this, A);
};
A.bar = A.foo + 1, A.foo, A.foo = 1;
