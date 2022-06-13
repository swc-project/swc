import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
import regeneratorRuntime from "regenerator-runtime";
// @target: es5
// @lib: esnext, dom
// @downlevelIteration: true
// https://github.com/Microsoft/TypeScript/issues/24722
var A = function A() {
    "use strict";
    _class_call_check(this, A);
    var _this = this;
    this.b = _async_to_generator(regeneratorRuntime.mark(function _callee() {
        var _len, args, _key, obj, _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    for(_len = _args.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                        args[_key] = _args[_key];
                    }
                    _ctx.next = 3;
                    return Promise.resolve();
                case 3:
                    obj = _define_property({}, "a", function() {
                        return _this;
                    }); // computed property name after `await` triggers case
                case 4:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
};
