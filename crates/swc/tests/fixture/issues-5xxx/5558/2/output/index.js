var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _create_class = require("@swc/helpers/_/_create_class");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check._(this, Foo);
    }
    _create_class._(Foo, [
        {
            key: "bar",
            value: function bar() {
                var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : /*#__PURE__*/ _async_to_generator._(function() {
                    return _ts_generator._(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    1
                                ];
                            case 1:
                                return [
                                    2,
                                    _state.sent()
                                ];
                        }
                    });
                });
            }
        }
    ]);
    return Foo;
}();
