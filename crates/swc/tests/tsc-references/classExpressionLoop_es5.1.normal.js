import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var _loop = function(i) {
    arr.push(function C() {
        "use strict";
        _class_call_check(this, C);
        this.prop = i;
    });
};
var arr = [];
for(var i = 0; i < 10; ++i)_loop(i);
