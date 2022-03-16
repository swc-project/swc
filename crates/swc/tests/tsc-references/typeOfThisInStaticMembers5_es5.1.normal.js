import * as swcHelpers from "@swc/helpers";
// @target: esnext, es2022, es6, es5
var C = function C(foo) {
    "use strict";
    swcHelpers.classCallCheck(this, C);
    this.foo = foo;
};
C.create = function() {
    return new C("yep");
};
