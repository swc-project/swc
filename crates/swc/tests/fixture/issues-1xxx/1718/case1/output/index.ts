import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import regeneratorRuntime from "regenerator-runtime";
function scanUser(groups) {
    return _scanUser.apply(this, arguments);
}
function _scanUser() {
    _scanUser = _async_to_generator(regeneratorRuntime.mark(function _callee1(groups) {
        return regeneratorRuntime.wrap(function _callee$(_ctx1) {
            while(1)switch(_ctx1.prev = _ctx1.next){
                case 0:
                    _ctx1.next = 2;
                    return Promise.all(groups.map(function() {
                        var _ref = _async_to_generator(regeneratorRuntime.mark(function _callee(param) {
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
                                        console.log("user", user);
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
                        }));
                        return function(_) {
                            return _ref.apply(this, arguments);
                        };
                    }()));
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
    }
]);
