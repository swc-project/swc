import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    _create_class(Foo, [
        {
            key: "sendSomeMessage",
            value: function sendSomeMessage(_parent, _param, _param1) {
                return _async_to_generator(function() {
                    var _input, toNumber, messageBody, all, dataSources;
                    return _ts_generator(this, function(_state) {
                        _input = _param.input, toNumber = _input.toNumber, messageBody = _input.messageBody, all = _object_without_properties(_param.input, [
                            "toNumber",
                            "messageBody"
                        ]), dataSources = _param1.dataSources;
                        return [
                            2
                        ];
                    });
                })();
            }
        }
    ]);
    return Foo;
}();
