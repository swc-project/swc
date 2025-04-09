function foo() {
    return /*#__PURE__*/ _async_to_generator(function() {
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
                        ].map(function(param) {
                            var _param = _sliced_to_array(param, 1), a = _param[0];
                            return /*#__PURE__*/ _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    return [
                                        2,
                                        Promise.resolve().then(function() {
                                            return a * 2;
                                        })
                                    ];
                                });
                            })();
                        }))
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
}
