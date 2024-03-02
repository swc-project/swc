import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var Foo = function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    _create_class(Foo, [
        {
            key: "bar",
            value: function bar() {
                var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
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
