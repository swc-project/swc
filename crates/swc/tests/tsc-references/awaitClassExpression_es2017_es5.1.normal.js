import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import regeneratorRuntime from "regenerator-runtime";
function func() {
    return _func.apply(this, arguments);
}
function _func() {
    _func = _async_to_generator(regeneratorRuntime.mark(function _callee() {
        var D;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.t0 = function(_superClass) {
                        "use strict";
                        _inherits(D, _superClass);
                        var _super = _create_super(D);
                        function D() {
                            _class_call_check(this, D);
                            return _super.apply(this, arguments);
                        }
                        return D;
                    };
                    _ctx.next = 3;
                    return p;
                case 3:
                    _ctx.t1 = _ctx.sent;
                    D = /*#__PURE__*/ (0, _ctx.t0)(_ctx.t1);
                case 5:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _func.apply(this, arguments);
}
