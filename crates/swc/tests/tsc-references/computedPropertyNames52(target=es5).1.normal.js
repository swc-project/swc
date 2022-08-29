//// [computedPropertyNames52.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var _loop = function(i) {
    var _i = void 0, _i1 = void 0;
    var _C;
    array.push((_i = i, _i1 = i, _C = function C() {
        "use strict";
        _class_call_check(this, C);
        this[_i] = function() {
            return C;
        };
    }, _C[_i1] = 100, _C));
};
var array = [];
for(var i = 0; i < 10; ++i)_loop(i);
