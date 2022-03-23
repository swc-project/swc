import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
var obj = {
    foo: 5,
    method: function method() {
        return swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
