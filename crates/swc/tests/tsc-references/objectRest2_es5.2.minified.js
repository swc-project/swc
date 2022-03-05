import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
!function(name) {
    var _ref;
    return {
        resolve: (_ref = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee(context, args) {
            var objects;
            return regeneratorRuntime.wrap(function(_ctx) {
                for(;;)switch(_ctx.prev = _ctx.next){
                    case 0:
                        return _ctx.next = 2, {
                            objects: 12
                        };
                    case 2:
                        return objects = _ctx.sent.objects, _ctx.abrupt("return", swcHelpers.objectSpread({}, connectionFromArray(objects, args)));
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
