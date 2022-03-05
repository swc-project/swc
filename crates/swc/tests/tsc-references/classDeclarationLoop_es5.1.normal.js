import * as swcHelpers from "@swc/helpers";
var _loop = function(i) {
    var C = function C() {
        "use strict";
        swcHelpers.classCallCheck(this, C);
        this.prop = i;
    };
    arr.push(C);
};
var arr = [];
for(var i = 0; i < 10; ++i)_loop(i);
