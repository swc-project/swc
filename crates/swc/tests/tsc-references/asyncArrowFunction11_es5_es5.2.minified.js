import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _define_property from "@swc/helpers/lib/_define_property.js";
import regeneratorRuntime from "regenerator-runtime";
var A = function() {
    "use strict";
    _class_call_check(this, A);
    var _this = this;
    this.b = _async_to_generator(regeneratorRuntime.mark(function _callee() {
        var _len, args, _key, obj, _args = arguments;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    for(args = Array(_len = _args.length), _key = 0; _key < _len; _key++)args[_key] = _args[_key];
                    return _ctx.next = 3, Promise.resolve();
                case 3:
                    obj = _define_property({}, "a", function() {
                        return _this;
                    });
                case 4:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
};
