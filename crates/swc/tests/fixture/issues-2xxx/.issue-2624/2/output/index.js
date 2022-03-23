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
function f() {
    return _f.apply(this, arguments);
}
function _f() {
    _f = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _ctx.prev = 1;
                    _loop = function(_iterator, _step) {
                        var i = _step.value;
                        setTimeout(function() {
                            return console.log(i);
                        }, 100);
                    };
                    for(_iterator = [
                        1,
                        2,
                        3
                    ][Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop(_iterator, _step);
                    _ctx.next = 10;
                    break;
                case 6:
                    _ctx.prev = 6;
                    _ctx.t0 = _ctx["catch"](1);
                    _didIteratorError = true;
                    _iteratorError = _ctx.t0;
                case 10:
                    _ctx.prev = 10;
                    _ctx.prev = 11;
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                case 13:
                    _ctx.prev = 13;
                    if (!_didIteratorError) {
                        _ctx.next = 16;
                        break;
                    }
                    throw _iteratorError;
                case 16:
                    return _ctx.finish(13);
                case 17:
                    return _ctx.finish(10);
                case 18:
                case "end":
                    return _ctx.stop();
            }
        }, _callee, null, [
            [
                1,
                6,
                10,
                18
            ],
            [
                11,
                ,
                13,
                17
            ]
        ]);
    }));
    return _f.apply(this, arguments);
}
