import * as swcHelpers from "@swc/helpers";
var _loop = function(i) {
    arr.push(function C() {
        "use strict";
        swcHelpers.classCallCheck(this, C);
        this.prop = i;
    });
};
var arr = [];
for(var i = 0; i < 10; ++i)_loop(i);
