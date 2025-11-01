//// [asyncArrowFunction11_es5.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
// https://github.com/Microsoft/TypeScript/issues/24722
var A = function A() {
    "use strict";
    var _this = this;
    _class_call_check(this, A);
    this.b = function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        return _async_to_generator(function() {
            var _this, obj;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _this = this;
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
        }).call(_this);
    };
};
