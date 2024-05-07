var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _create_class = require("@swc/helpers/_/_create_class");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check._(this, A);
    }
    _create_class._(A, [
        {
            key: "method",
            value: function method() {
                var _this = this;
                this.foo = /*#__PURE__*/ _async_to_generator._(function() {
                    return _ts_generator._(this, function(_state) {
                        _this.x();
                        return [
                            2
                        ];
                    });
                });
                var _this1 = this;
                this.bar = /*#__PURE__*/ _async_to_generator._(function() {
                    return _ts_generator._(this, function(_state) {
                        _this1.x();
                        return [
                            2
                        ];
                    });
                });
            }
        }
    ]);
    return A;
}();
console.log(A);
