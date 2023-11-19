//// [classExpressionLoop.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var arr = [];
var _loop = function(i) {
    arr.push(function C() {
        "use strict";
        _class_call_check(this, C);
        this.prop = i;
    });
};
for(var i = 0; i < 10; ++i)_loop(i);
