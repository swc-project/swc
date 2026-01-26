import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var A = function A() {
    "use strict";
    var _this = this;
    _class_call_check(this, A);
    this.foo = function() {
        return _async_to_generator(function() {
            return _ts_generator(this, function(_state) {
                this.x();
                return [
                    2
                ];
            });
        }).call(_this);
    };
    this.bar = function() {
        return _async_to_generator(function() {
            return _ts_generator(this, function(_state) {
                this.x();
                return [
                    2
                ];
            });
        }).call(_this);
    };
};
console.log(A);
