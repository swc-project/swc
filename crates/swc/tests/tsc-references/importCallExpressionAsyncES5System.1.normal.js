//// [test.ts]
System.register([
    "@swc/helpers/src/_async_to_generator.mjs",
    "@swc/helpers/src/_class_call_check.mjs",
    "@swc/helpers/src/_ts_generator.mjs"
], function(_export, _context) {
    "use strict";
    var _async_to_generator, _class_call_check, _ts_generator, cl1, obj, cl2, l;
    function fn() {
        return _fn.apply(this, arguments);
    }
    function _fn() {
        _fn = _async_to_generator(function() {
            var req;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            _context.import("./test") // ONE
                        ];
                    case 1:
                        req = _state.sent();
                        return [
                            2
                        ];
                }
            });
        });
        return _fn.apply(this, arguments);
    }
    _export("fn", fn);
    return {
        setters: [
            function(_asyncToGenerator) {
                _async_to_generator = _asyncToGenerator.default;
            },
            function(_classCallCheck) {
                _class_call_check = _classCallCheck.default;
            },
            function(_tsGenerator) {
                _ts_generator = _tsGenerator.default;
            }
        ],
        execute: function() {
            _export("cl1", cl1 = /*#__PURE__*/ function() {
                "use strict";
                function cl1() {
                    _class_call_check(this, cl1);
                }
                var _proto = cl1.prototype;
                _proto.m = function m() {
                    return _async_to_generator(function() {
                        var req;
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    return [
                                        4,
                                        import("./test") // TWO
                                    ];
                                case 1:
                                    req = _state.sent();
                                    return [
                                        2
                                    ];
                            }
                        });
                    })();
                };
                return cl1;
            }());
            _export("obj", obj = {
                m: /*#__PURE__*/ _async_to_generator(function() {
                    var req;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    import("./test") // THREE
                                ];
                            case 1:
                                req = _state.sent();
                                return [
                                    2
                                ];
                        }
                    });
                })
            });
            _export("cl2", cl2 = function cl2() {
                "use strict";
                _class_call_check(void 0, cl2);
                (void 0).p = {
                    m: /*#__PURE__*/ _async_to_generator(function() {
                        var req;
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    return [
                                        4,
                                        import("./test") // FOUR
                                    ];
                                case 1:
                                    req = _state.sent();
                                    return [
                                        2
                                    ];
                            }
                        });
                    })
                };
            });
            _export("l", l = function() {
                var _ref = _async_to_generator(function() {
                    var req;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    import("./test") // FIVE
                                ];
                            case 1:
                                req = _state.sent();
                                return [
                                    2
                                ];
                        }
                    });
                });
                return function l() {
                    return _ref.apply(this, arguments);
                };
            }());
        }
    };
});
