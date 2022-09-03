//// [asyncArrowFunction11_es5.ts]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
    var _this = this;
    this.b = _async_to_generator(function() {
        var _len, args, _key, obj, _arguments = arguments;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    for(args = Array(_len = _arguments.length), _key = 0; _key < _len; _key++)args[_key] = _arguments[_key];
                    return [
                        4,
                        Promise.resolve()
                    ];
                case 1:
                    return _state.sent(), obj = _define_property({}, "a", function() {
                        return _this;
                    }), [
                        2
                    ];
            }
        });
    });
};
