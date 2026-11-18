import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var foo = {
    bar: function bar(_0) {
        return _async_to_generator(function(param) {
            var name;
            var _arguments = arguments;
            return _ts_generator(this, function(_state) {
                name = param.name;
                console.log("arguments.length", _arguments.length);
                return [
                    2
                ];
            });
        }).apply(this, arguments);
    }
};
var Foo = /*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _class_call_check(this, Foo);
    }
    _create_class(Foo, [
        {
            key: "bar",
            value: function bar(_0) {
                return _async_to_generator(function(param) {
                    var name;
                    var _arguments = arguments;
                    return _ts_generator(this, function(_state) {
                        name = param.name;
                        console.log("arguments.length", _arguments.length);
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
function bar(_0) {
    return _async_to_generator(function(param) {
        var name;
        var _arguments = arguments;
        return _ts_generator(this, function(_state) {
            name = param.name;
            console.log("arguments.length", _arguments.length);
            return [
                2
            ];
        });
    }).apply(this, arguments);
}
