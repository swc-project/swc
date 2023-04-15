//// [asyncArrowFunction11_es5.ts]
// https://github.com/Microsoft/TypeScript/issues/24722
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
    var _this = this;
    this.b = /*#__PURE__*/ _async_to_generator(function() {
        var _len, args, _key, obj;
        var _arguments = arguments;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    for(_len = _arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                        args[_key] = _arguments[_key];
                    }
                    return [
                        4,
                        Promise.resolve()
                    ];
                case 1:
                    _state.sent();
                    obj = _define_property({}, "a", function() {
                        return _this;
                    }); // computed property name after `await` triggers case
                    return [
                        2
                    ];
            }
        });
    });
};
