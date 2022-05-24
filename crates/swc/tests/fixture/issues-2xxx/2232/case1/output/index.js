import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
import _object_without_properties from "@swc/helpers/lib/_object_without_properties.js";
import regeneratorRuntime from "regenerator-runtime";
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    _create_class(Foo, [
        {
            key: "sendSomeMessage",
            value: function sendSomeMessage(_parent, _param, _param1) {
                return _async_to_generator(regeneratorRuntime.mark(function _callee() {
                    var _input, toNumber, messageBody, all, dataSources;
                    return regeneratorRuntime.wrap(function _callee$(_ctx) {
                        while(1)switch(_ctx.prev = _ctx.next){
                            case 0:
                                _input = _param.input, toNumber = _input.toNumber, messageBody = _input.messageBody, all = _object_without_properties(_param.input, [
                                    "toNumber",
                                    "messageBody"
                                ]), dataSources = _param1.dataSources;
                            case 1:
                            case "end":
                                return _ctx.stop();
                        }
                    }, _callee);
                }))();
            }
        }
    ]);
    return Foo;
}();
