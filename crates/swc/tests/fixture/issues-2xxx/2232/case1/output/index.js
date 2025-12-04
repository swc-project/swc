import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    _create_class(Foo, [
        {
            key: "sendSomeMessage",
            value: function sendSomeMessage(_0, _1, _2) {
                return _async_to_generator(function(_parent, _param, param) {
                    var dataSources, _ref, toNumber, messageBody, all;
                    return _ts_generator(this, function(_state) {
                        dataSources = param.dataSources;
                        _ref = _param.input, toNumber = _ref.toNumber, messageBody = _ref.messageBody, all = _object_without_properties(_ref, [
                            "toNumber",
                            "messageBody"
                        ]);
                        return [
                            2
                        ];
                    });
                }).apply(this, arguments);
            }
        }
    ]);
    return Foo;
}();
