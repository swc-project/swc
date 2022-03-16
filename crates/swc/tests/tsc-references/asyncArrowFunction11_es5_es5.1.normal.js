import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
// @target: es5
// @lib: esnext, dom
// @downlevelIteration: true
// https://github.com/Microsoft/TypeScript/issues/24722
var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
    var _this = this;
    this.b = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
                    obj = swcHelpers.defineProperty({}, "a", function() {
                        return _this;
                    }); // computed property name after `await` triggers case
                case 4:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
};
