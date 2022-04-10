import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var A = function() {
    swcHelpers.classCallCheck(this, A);
    var _this = this;
    this.b = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var _len, args, _key, obj, _args = arguments;
        return regeneratorRuntime.wrap(function(_ctx) {
            for(;;)switch(_ctx.prev = _ctx.next){
                case 0:
                    for(_len = _args.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = _args[_key];
                    return _ctx.next = 3, Promise.resolve();
                case 3:
                    obj = swcHelpers.defineProperty({}, "a", function() {
                        return _this;
                    });
                case 4:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
};
