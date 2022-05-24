import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import _sliced_to_array from "@swc/helpers/lib/_sliced_to_array.js";
import regeneratorRuntime from "regenerator-runtime";
function f(a, b) {
    return _f.apply(this, arguments);
}
function _f() {
    _f = _async_to_generator(regeneratorRuntime.mark(function _callee(a, b) {
        var ref, ref1, tmp, a_;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    ref = _sliced_to_array(JSON.parse(b), 1), ref1 = ref[0], tmp = ref1.a, a_ = tmp === void 0 ? 1 : tmp;
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _f.apply(this, arguments);
}
