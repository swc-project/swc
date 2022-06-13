import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import regeneratorRuntime from "regenerator-runtime";
var handleSubmit = useMutation(_async_to_generator(regeneratorRuntime.mark(function _callee() {
    var res, errors;
    return regeneratorRuntime.wrap(function _callee$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                _ctx.prev = 0;
                _ctx.next = 3;
                return gate.register({
                    username: phoneNumber
                });
            case 3:
                res = _ctx.sent;
                setstep(function(prev) {
                    return prev + 1;
                });
                toast.success(res.message);
                _ctx.next = 12;
                break;
            case 8:
                _ctx.prev = 8;
                _ctx.t0 = _ctx["catch"](0);
                errors = _ctx.t0.data.errors;
                showErrorMessage(errors);
            case 12:
            case "end":
                return _ctx.stop();
        }
    }, _callee, null, [
        [
            0,
            8
        ]
    ]);
})));
