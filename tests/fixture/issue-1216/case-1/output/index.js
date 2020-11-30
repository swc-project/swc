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
var regeneratorRuntime = require("regenerator-runtime");
var _marked = regeneratorRuntime.mark(_request);
var source = Math.random() < 2 ? 'matilda' : 'fred';
var details = {
    _id: '1'
};
function _request() {
    _request = _asyncToGenerator(regeneratorRuntime.mark(function _callee(path) {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    return _ctx.abrupt("return", "success:".concat(path));
                case 1:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _request.apply(this, arguments);
}
function request(path) {
    return _request.apply(this, arguments);
}
_asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var obj;
    return regeneratorRuntime.wrap(function _callee$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                if (!(source === 'matilda')) {
                    _ctx.next = 4;
                    break;
                }
                _ctx.t0 = details;
                _ctx.next = 7;
                break;
            case 4:
                _ctx.next = 6;
                return request("/".concat(details._id, "?source=").concat(source));
            case 6:
                _ctx.t0 = _ctx.sent;
            case 7:
                obj = _ctx.t0;
                console.log({
                    obj: obj
                });
            case 9:
            case "end":
                return _ctx.stop();
        }
    }, _callee);
}))();
