//// [test.ts]
var global, factory;
global = this, factory = function(exports1, _async_to_generator, _class_call_check, _interop_require_wildcard, _ts_generator) {
    function fn() {
        return _fn.apply(this, arguments);
    }
    function _fn() {
        return (_fn = _async_to_generator._(function() {
            return _ts_generator._(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            import('./test')
                        ];
                    case 1:
                        return _state.sent(), [
                            2
                        ];
                }
            });
        })).apply(this, arguments);
    }
    Object.defineProperty(exports1, "__esModule", {
        value: !0
    }), function(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: !0,
            get: all[name]
        });
    }(exports1, {
        cl1: function() {
            return cl1;
        },
        cl2: function() {
            return cl2;
        },
        fn: function() {
            return fn;
        },
        l: function() {
            return l;
        },
        obj: function() {
            return obj;
        }
    });
    var _ref, cl1 = /*#__PURE__*/ function() {
        function cl1() {
            _class_call_check._(this, cl1);
        }
        return cl1.prototype.m = function() {
            return _async_to_generator._(function() {
                return _ts_generator._(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                import('./test')
                            ];
                        case 1:
                            return _state.sent(), [
                                2
                            ];
                    }
                });
            })();
        }, cl1;
    }(), obj = {
        m: /*#__PURE__*/ _async_to_generator._(function() {
            return _ts_generator._(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            import('./test')
                        ];
                    case 1:
                        return _state.sent(), [
                            2
                        ];
                }
            });
        })
    }, cl2 = function cl2() {
        _class_call_check._(this, cl2), this.p = {
            m: /*#__PURE__*/ _async_to_generator._(function() {
                return _ts_generator._(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                import('./test')
                            ];
                        case 1:
                            return _state.sent(), [
                                2
                            ];
                    }
                });
            })
        };
    }, l = (_ref = _async_to_generator._(function() {
        return _ts_generator._(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        import('./test')
                    ];
                case 1:
                    return _state.sent(), [
                        2
                    ];
            }
        });
    }), function() {
        return _ref.apply(this, arguments);
    });
}, "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/_/_async_to_generator"), require("@swc/helpers/_/_class_call_check"), require("@swc/helpers/_/_interop_require_wildcard"), require("@swc/helpers/_/_ts_generator")) : "function" == typeof define && define.amd ? define([
    "exports",
    "@swc/helpers/_/_async_to_generator",
    "@swc/helpers/_/_class_call_check",
    "@swc/helpers/_/_interop_require_wildcard",
    "@swc/helpers/_/_ts_generator"
], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.testTs = {}, global.asyncToGenerator, global.classCallCheck, global.interopRequireWildcard, global.tsGenerator);
