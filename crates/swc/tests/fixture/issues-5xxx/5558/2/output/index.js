import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import regeneratorRuntime from "regenerator-runtime";
var Foo = function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    _create_class(Foo, [
        {
            key: "bar",
            value: function bar() {
                var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : _async_to_generator(regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                _ctx.next = 2;
                                return 1;
                            case 2:
                                return _ctx.abrupt("return", _ctx.sent);
                            case 3:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }));
            }
        }
    ]);
    return Foo;
}();
