import * as swcHelpers from "@swc/helpers";
var C = function(foo) {
    "use strict";
    swcHelpers.classCallCheck(this, C), this.foo = foo;
};
C.create = function() {
    return new C("yep");
};
