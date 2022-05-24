import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import _object_spread from "@swc/helpers/lib/_object_spread.js";
import regeneratorRuntime from "regenerator-runtime";
function rootConnection(name) {
    return {
        resolve: function() {
            var _ref = _async_to_generator(regeneratorRuntime.mark(function _callee(context, args) {
                var objects;
                return regeneratorRuntime.wrap(function _callee$(_ctx) {
                    while(1)switch(_ctx.prev = _ctx.next){
                        case 0:
                            _ctx.next = 2;
                            return {
                                objects: 12
                            };
                        case 2:
                            objects = _ctx.sent.objects;
                            return _ctx.abrupt("return", _object_spread({}, connectionFromArray(objects, args)));
                        case 4:
                        case "end":
                            return _ctx.stop();
                    }
                }, _callee);
            }));
            return function(context, args) {
                return _ref.apply(this, arguments);
            };
        }()
    };
}
rootConnection("test");
