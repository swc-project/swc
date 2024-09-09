function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Promise.all([
                            [
                                1
                            ],
                            [
                                2
                            ],
                            [
                                3
                            ]
                        ].map(/*#__PURE__*/ function() {
                            var _ref = _async_to_generator(function(param) {
                                var _param, a;
                                return _ts_generator(this, function(_state) {
                                    _param = _sliced_to_array(param, 1), a = _param[0];
                                    return [
                                        2,
                                        Promise.resolve().then(function() {
                                            return a * 2;
                                        })
                                    ];
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
    return _foo.apply(this, arguments);
}
