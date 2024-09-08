//// [test.ts]
System.register([
    "@swc/helpers/_/_async_to_generator",
    "@swc/helpers/_/_class_call_check",
    "@swc/helpers/_/_ts_generator"
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
                            _context.import('./test') // ONE
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
                                        _context.import('./test') // TWO
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
                                    _context.import('./test') // THREE
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
                _class_call_check(this, cl2);
                this.p = {
                    m: /*#__PURE__*/ _async_to_generator(function() {
                        var req;
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    return [
                                        4,
                                        _context.import('./test') // FOUR
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
            _export("l", l = /*#__PURE__*/ function() {
                var _ref = _async_to_generator(function() {
                    var req;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    _context.import('./test') // FIVE
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
