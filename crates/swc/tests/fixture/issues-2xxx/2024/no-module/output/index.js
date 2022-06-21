import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import regeneratorRuntime from "regenerator-runtime";
_async_to_generator(regeneratorRuntime.mark(function _callee() {
    var sleep, result;
    return regeneratorRuntime.wrap(function _callee$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                sleep = function() {
                    return new Promise(function(resolve) {
                        return setTimeout(function() {
                            return resolve(undefined);
                        }, 500);
                    });
                };
                _ctx.next = 3;
                return sleep();
            case 3:
                _ctx.t0 = _ctx.sent;
                if (_ctx.t0) {
                    _ctx.next = 6;
                    break;
                }
                _ctx.t0 = "fallback";
            case 6:
                result = _ctx.t0;
                console.log(result);
            case 8:
            case "end":
                return _ctx.stop();
        }
    }, _callee);
}))();
