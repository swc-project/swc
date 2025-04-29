var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _create_class = require("@swc/helpers/_/_create_class");
var _object_without_properties = require("@swc/helpers/_/_object_without_properties");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check._(this, Foo);
    }
    _create_class._(Foo, [
        {
            key: "sendSomeMessage",
            value: function sendSomeMessage(_parent, _param, _param1) {
                return _async_to_generator._(function() {
                    var _param_input, toNumber, messageBody, all, dataSources;
                    return _ts_generator._(this, function(_state) {
                        _param_input = _param.input, toNumber = _param_input.toNumber, messageBody = _param_input.messageBody, all = _object_without_properties._(_param.input, [
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
