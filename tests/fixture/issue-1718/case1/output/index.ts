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
function _scanUser() {
    _scanUser = _asyncToGenerator(regeneratorRuntime.mark(function _callee(groups) {
        return regeneratorRuntime.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return Promise.all(groups.map(_asyncToGenerator(regeneratorRuntime.mark(function _callee(param) {
                        var users = param.users;
                        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, user;
                        return regeneratorRuntime.wrap(function _callee$(_ctx) {
                            while(1)switch(_ctx.prev = _ctx.next){
                                case 0:
                                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                    _ctx.prev = 1;
                                    _iterator = users[Symbol.iterator]();
                                case 3:
                                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                        _ctx.next = 11;
                                        break;
                                    }
                                    user = _step.value;
                                    console.log('user', user);
                                    _ctx.next = 8;
                                    return new Promise(function(resolve) {
                                        return setTimeout(resolve, 30);
                                    });
                                case 8:
                                    _iteratorNormalCompletion = true;
                                    _ctx.next = 3;
                                    break;
                                case 11:
                                    _ctx.next = 17;
                                    break;
                                case 13:
                                    _ctx.prev = 13;
                                    _ctx.t0 = _ctx["catch"](1);
                                    _didIteratorError = true;
                                    _iteratorError = _ctx.t0;
                                case 17:
                                    _ctx.prev = 17;
                                    _ctx.prev = 18;
                                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                                        _iterator.return();
                                    }
                                case 20:
                                    _ctx.prev = 20;
                                    if (!_didIteratorError) {
                                        _ctx.next = 23;
                                        break;
                                    }
                                    throw _iteratorError;
                                case 23:
                                    return _ctx.finish(20);
                                case 24:
                                    return _ctx.finish(17);
                                case 25:
                                case "end":
                                    return _ctx.stop();
                            }
                        }, _callee, null, [
                            [
                                18,
                                ,
                                20,
                                24
                            ],
                            [
                                1,
                                13,
                                17,
                                25
                            ]
                        ]);
                    }))));
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _scanUser.apply(this, arguments);
}
function scanUser(groups) {
    return _scanUser.apply(this, arguments);
}
scanUser([
    {
        users: [
            1,
            2,
            3,
            4,
            5
        ]
    },
    {
        users: [
            11,
            12,
            13,
            14,
            15
        ]
    }, 
]);
