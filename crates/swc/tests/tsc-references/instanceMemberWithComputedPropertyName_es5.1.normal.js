// https://github.com/microsoft/TypeScript/issues/30953
"use strict";
import * as swcHelpers from "@swc/helpers";
var x = 1;
var C = function C() {
    swcHelpers.classCallCheck(this, C);
    this[x] = true;
    var ref = {
        a: 1,
        b: 2
    }, a = ref.a, b = ref.b;
};
