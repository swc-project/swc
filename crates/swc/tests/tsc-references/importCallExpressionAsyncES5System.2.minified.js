//// [test.ts]
System.register([
    "@swc/helpers/_/_async_to_generator",
    "@swc/helpers/_/_class_call_check",
    "@swc/helpers/_/_ts_generator"
], function(_export, _context) {
    var _async_to_generator, _class_call_check, _ts_generator;
    return _export("fn", function() {
        return /*#__PURE__*/ _async_to_generator(function() {
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            _context.import('./test')
                        ];
                    case 1:
                        return _state.sent(), [
                            2
                        ];
                }
            });
        })();
    }), {
        setters: [
            function(_async_to_generator1) {
                _async_to_generator = _async_to_generator1._;
            },
            function(_class_call_check1) {
                _class_call_check = _class_call_check1._;
            },
            function(_ts_generator1) {
                _ts_generator = _ts_generator1._;
            }
        ],
        execute: function() {
            _export("cl1", /*#__PURE__*/ function() {
                function cl1() {
                    _class_call_check(this, cl1);
                }
                return cl1.prototype.m = function() {
                    return /*#__PURE__*/ _async_to_generator(function() {
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    return [
                                        4,
                                        _context.import('./test')
                                    ];
                                case 1:
                                    return _state.sent(), [
                                        2
                                    ];
                            }
                        });
                    })();
                }, cl1;
            }()), _export("obj", {
                m: function() {
                    return /*#__PURE__*/ _async_to_generator(function() {
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    return [
                                        4,
                                        _context.import('./test')
                                    ];
                                case 1:
                                    return _state.sent(), [
                                        2
                                    ];
                            }
                        });
                    })();
                }
            }), _export("cl2", function cl2() {
                _class_call_check(this, cl2), this.p = {
                    m: function() {
                        return /*#__PURE__*/ _async_to_generator(function() {
                            return _ts_generator(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        return [
                                            4,
                                            _context.import('./test')
                                        ];
                                    case 1:
                                        return _state.sent(), [
                                            2
                                        ];
                                }
                            });
                        })();
                    }
                };
            }), _export("l", function() {
                return /*#__PURE__*/ _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    _context.import('./test')
                                ];
                            case 1:
                                return _state.sent(), [
                                    2
                                ];
                        }
                    });
                })();
            });
        }
    };
});
