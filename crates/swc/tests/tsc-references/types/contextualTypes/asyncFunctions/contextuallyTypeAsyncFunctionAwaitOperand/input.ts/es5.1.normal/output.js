import regeneratorRuntime from "regenerator-runtime";
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
function fn1() {
    return _fn1.apply(this, arguments);
}
function _fn1() {
    _fn1 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var obj1, obj2;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return {
                        key: "value"
                    };
                case 2:
                    obj1 = _ctx.sent;
                    _ctx.next = 5;
                    return new Promise(function(resolve) {
                        return resolve({
                            key: "value"
                        });
                    });
                case 5:
                    obj2 = _ctx.sent;
                    _ctx.next = 8;
                    return {
                        key: "value"
                    };
                case 8:
                    return _ctx.abrupt("return", _ctx.sent);
                case 9:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _fn1.apply(this, arguments);
}
