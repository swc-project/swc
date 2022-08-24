import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    _create_class(A, [
        {
            key: "method",
            value: function method() {
                var _this = this;
                this.foo = /*#__PURE__*/ _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        _this.x();
                        return [
                            2
                        ];
                    });
                });
                var _this1 = this;
                this.bar = /*#__PURE__*/ _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
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
