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
            }
        }
    ]);
    return A;
}();
console.log(A);
