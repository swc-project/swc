function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
import regeneratorRuntime from "regenerator-runtime";
var handleSubmit = useMutation(_asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
