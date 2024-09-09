//// [test.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_async_to_generator",
    "@swc/helpers/_/_interop_require_wildcard"
], function(require, exports, _async_to_generator, _interop_require_wildcard) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
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
    function fn() {
        return _fn.apply(this, arguments);
    }
    function _fn() {
        _fn = _async_to_generator._(function*() {
            const req = yield new Promise((resolve, reject)=>require([
                    "./test"
                ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject)) // ONE
            ;
        });
        return _fn.apply(this, arguments);
    }
    class cl1 {
        m() {
            return _async_to_generator._(function*() {
                const req = yield new Promise((resolve, reject)=>require([
                        "./test"
                    ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject)) // TWO
                ;
            })();
        }
    }
    const obj = {
        m: /*#__PURE__*/ _async_to_generator._(function*() {
            const req = yield new Promise((resolve, reject)=>require([
                    "./test"
                ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject)) // THREE
            ;
        })
    };
    class cl2 {
        constructor(){
            this.p = {
                m: /*#__PURE__*/ _async_to_generator._(function*() {
                    const req = yield new Promise((resolve, reject)=>require([
                            "./test"
                        ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject)) // FOUR
                    ;
                })
            };
        }
    }
    const l = /*#__PURE__*/ function() {
        var _ref = _async_to_generator._(function*() {
            const req = yield new Promise((resolve, reject)=>require([
                    "./test"
                ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject)) // FIVE
            ;
        });
        return function l() {
            return _ref.apply(this, arguments);
        };
    }();
});
