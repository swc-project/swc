var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
var A = function A() {
    "use strict";
    _class_call_check._(this, A);
    var _this = this;
    this.foo = /*#__PURE__*/ _async_to_generator._(function() {
        return _ts_generator._(this, function(_state) {
            _this.x();
            return [
                2
            ];
        });
    });
    this.bar = /*#__PURE__*/ _async_to_generator._(function() {
        return _ts_generator._(this, function(_state) {
            _this.x();
            return [
                2
            ];
        });
    });
};
console.log(A);
