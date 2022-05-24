import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import regeneratorRuntime from "regenerator-runtime";
var obj = {
    find: function find(param) {
        var platform = param.platform;
        return {
            platform: platform
        };
    },
    byPlatform: function() {
        var _ref = _async_to_generator(regeneratorRuntime.mark(function _callee(platform) {
            var result;
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _ctx.next = 2;
                        return this.find({
                            platform: {
                                $eq: platform
                            }
                        });
                    case 2:
                        result = _ctx.sent;
                        return _ctx.abrupt("return", result);
                    case 4:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee, this);
        }));
        return function(platform) {
            return _ref.apply(this, arguments);
        };
    }()
};
obj.byPlatform("foo").then(function(v) {
    return console.log(v);
});
