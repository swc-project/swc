import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
for(var _loop = function(i) {
    var C = function() {
        "use strict";
        _class_call_check(this, C), this.prop = i;
    };
    arr.push(C);
}, arr = [], i = 0; i < 10; ++i)_loop(i);
