var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _create_class = require("@swc/helpers/_/_create_class");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
var _wrap_async_generator = require("@swc/helpers/_/_wrap_async_generator");
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check._(this, A);
    }
    _create_class._(A, [
        {
            key: "method1",
            value: function method1() {}
        },
        {
            key: "method2",
            value: function method2() {}
        },
        {
            key: "method3",
            value: function method3() {}
        },
        {
            key: "method4",
            value: // max markers count
            function method4() {
                return _wrap_async_generator._(function() {
                    return _ts_generator._(this, function(_state) {
                        return [
                            2
                        ];
                    });
                })();
            }
        }
    ]);
    return A;
}();
var B = function B(params) {
    "use strict";
    _class_call_check._(this, B);
    var Nested = /*#__PURE__*/ function() {
        function Nested() {
            _class_call_check._(this, Nested);
        }
        _create_class._(Nested, [
            {
                key: "method",
                value: function method() {}
            }
        ]);
        return Nested;
    }();
};
