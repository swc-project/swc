import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import regeneratorRuntime from "regenerator-runtime";
var obj = {
    foo: 5,
    method: function method() {
        return _async_to_generator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        return _ctx.abrupt("return", this.foo);
                    case 1:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee, this);
        })).apply(this);
    }
};
obj.method().then(function(v) {
    return console.log(v);
});
