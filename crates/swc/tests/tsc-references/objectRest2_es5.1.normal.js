import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
function rootConnection(name) {
    return {
        resolve: function() {
            var _ref = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee(context, args) {
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
                            return _ctx.abrupt("return", swcHelpers.objectSpread({}, connectionFromArray(objects, args)));
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
rootConnection('test');
