var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
function scanUser(groups) {
    return _scanUser.apply(this, arguments);
}
function _scanUser() {
    _scanUser = _async_to_generator._(function(groups) {
        return _ts_generator._(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Promise.all(groups.map(/*#__PURE__*/ function() {
                            var _ref = _async_to_generator._(function(param) {
                                var users, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, user, err;
                                return _ts_generator._(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            users = param.users;
                                            _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                            _state.label = 1;
                                        case 1:
                                            _state.trys.push([
                                                1,
                                                6,
                                                7,
                                                8
                                            ]);
                                            _iterator = users[Symbol.iterator]();
                                            _state.label = 2;
                                        case 2:
                                            if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                                3,
                                                5
                                            ];
                                            user = _step.value;
                                            console.log("user", user);
                                            return [
                                                4,
                                                new Promise(function(resolve) {
                                                    return setTimeout(resolve, 30);
                                                })
                                            ];
                                        case 3:
                                            _state.sent();
                                            _state.label = 4;
                                        case 4:
                                            _iteratorNormalCompletion = true;
                                            return [
                                                3,
                                                2
                                            ];
                                        case 5:
                                            return [
                                                3,
                                                8
                                            ];
                                        case 6:
                                            err = _state.sent();
                                            _didIteratorError = true;
                                            _iteratorError = err;
                                            return [
                                                3,
                                                8
                                            ];
                                        case 7:
                                            try {
                                                if (!_iteratorNormalCompletion && _iterator.return != null) {
                                                    _iterator.return();
                                                }
                                            } finally{
                                                if (_didIteratorError) {
                                                    throw _iteratorError;
                                                }
                                            }
                                            return [
                                                7
                                            ];
                                        case 8:
                                            return [
                                                2
                                            ];
                                    }
                                });
                            });
                            return function(_) {
                                return _ref.apply(this, arguments);
                            };
                        }()))
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    });
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
