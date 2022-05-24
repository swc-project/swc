import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import _object_spread from "@swc/helpers/lib/_object_spread.js";
import regeneratorRuntime from "regenerator-runtime";
!function(name) {
    var _ref;
    return {
        resolve: (_ref = _async_to_generator(regeneratorRuntime.mark(function _callee(context, args) {
            var objects;
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        return _ctx.next = 2, {
                            objects: 12
                        };
                    case 2:
                        return objects = _ctx.sent.objects, _ctx.abrupt("return", _object_spread({}, connectionFromArray(objects, args)));
                    case 4:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        })), function(context, args) {
            return _ref.apply(this, arguments);
        })
    };
}("test");
