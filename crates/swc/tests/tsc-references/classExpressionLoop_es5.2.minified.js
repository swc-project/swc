import * as swcHelpers from "@swc/helpers";
for(var _loop = function(i) {
    arr.push(function C() {
        "use strict";
        swcHelpers.classCallCheck(this, C), this.prop = i;
    });
}, arr = [], i = 0; i < 10; ++i)_loop(i);
