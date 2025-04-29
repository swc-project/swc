var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
var A = function A() {
    "use strict";
    var _this = this;
    _class_call_check._(this, A);
    this.foo = function() {
        return _async_to_generator._(function() {
            return _ts_generator._(this, function(_state) {
                this.x();
                return [
                    2
                ];
            });
        }).call(_this);
    };
    this.bar = function() {
        return _async_to_generator._(function() {
            return _ts_generator._(this, function(_state) {
                this.x();
                return [
                    2
                ];
            });
        }).call(_this);
    };
};
console.log(A);
