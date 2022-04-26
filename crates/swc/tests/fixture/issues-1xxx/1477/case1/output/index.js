import * as swcHelpers from "@swc/helpers";
import regeneratorRuntime from "regenerator-runtime";
function f(a, b) {
    return _f.apply(this, arguments);
}
function _f() {
    _f = swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee(a, b) {
        var ref, ref1, tmp, a_;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    ref = swcHelpers.slicedToArray(JSON.parse(b), 1), ref1 = ref[0], tmp = ref1.a, a_ = tmp === void 0 ? 1 : tmp;
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _f.apply(this, arguments);
}
