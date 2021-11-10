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
function scanUser(groups) {
    return _scanUser.apply(this, arguments);
}
function _scanUser() {
    _scanUser = _asyncToGenerator(regeneratorRuntime.mark(function _callee1(groups) {
        return regeneratorRuntime.wrap(function _callee$(_ctx1) {
            while(1)switch(_ctx1.prev = _ctx1.next){
                case 0:
                    _ctx1.next = 2;
                    return Promise.all(groups.map(_asyncToGenerator(regeneratorRuntime.mark(function _callee(param) {
                        var users, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, user;
                        return regeneratorRuntime.wrap(function _callee$(_ctx) {
                            while(1)switch(_ctx.prev = _ctx.next){
                                case 0:
                                    users = param.users;
                                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                    _ctx.prev = 2;
                                    _iterator = users[Symbol.iterator]();
                                case 4:
                                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                        _ctx.next = 12;
                                        break;
                                    }
                                    user = _step.value;
                                    console.log('user', user);
                                    _ctx.next = 9;
                                    return new Promise(function(resolve) {
                                        return setTimeout(resolve, 30);
                                    });
                                case 9:
                                    _iteratorNormalCompletion = true;
                                    _ctx.next = 4;
                                    break;
                                case 12:
                                    _ctx.next = 18;
                                    break;
                                case 14:
                                    _ctx.prev = 14;
                                    _ctx.t0 = _ctx["catch"](2);
                                    _didIteratorError = true;
                                    _iteratorError = _ctx.t0;
                                case 18:
                                    _ctx.prev = 18;
                                    _ctx.prev = 19;
                                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                                        _iterator.return();
                                    }
                                case 21:
                                    _ctx.prev = 21;
                                    if (!_didIteratorError) {
                                        _ctx.next = 24;
                                        break;
                                    }
                                    throw _iteratorError;
                                case 24:
                                    return _ctx.finish(21);
                                case 25:
                                    return _ctx.finish(18);
                                case 26:
                                case "end":
                                    return _ctx.stop();
                            }
                        }, _callee, null, [
                            [
                                2,
                                14,
                                18,
                                26
                            ],
                            [
                                19,
                                ,
                                21,
                                25
                            ]
                        ]);
                    }))));
                case 2:
                case "end":
                    return _ctx1.stop();
            }
        }, _callee1);
    }));
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
