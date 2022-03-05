import * as swcHelpers from "@swc/helpers";
var C = function C(x) {
    "use strict";
    swcHelpers.classCallCheck(this, C);
    this.a = z // error
    ;
    this.c = this.z // error
    ;
    z = 1;
};
var D = function D(x) {
    "use strict";
    swcHelpers.classCallCheck(this, D);
    this.a = z // error
    ;
    this.c = this.z // error
    ;
    z = 1;
};
