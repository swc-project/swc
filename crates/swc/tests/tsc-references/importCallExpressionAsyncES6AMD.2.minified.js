//// [test.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_async_to_generator",
    "@swc/helpers/_/_interop_require_wildcard"
], function(require, exports, _async_to_generator, _interop_require_wildcard) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var _ref, all = {
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
    };
    for(var name in all)Object.defineProperty(exports, name, {
        enumerable: !0,
        get: all[name]
    });
    function fn() {
        return _fn.apply(this, arguments);
    }
    function _fn() {
        return (_fn = _async_to_generator._(function*() {
            yield new Promise((resolve, reject)=>require([
                    "./test"
                ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject));
        })).apply(this, arguments);
    }
    class cl1 {
        m() {
            return _async_to_generator._(function*() {
                yield new Promise((resolve, reject)=>require([
                        "./test"
                    ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject));
            })();
        }
    }
    let obj = {
        m: /*#__PURE__*/ _async_to_generator._(function*() {
            yield new Promise((resolve, reject)=>require([
                    "./test"
                ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject));
        })
    };
    class cl2 {
        constructor(){
            this.p = {
                m: /*#__PURE__*/ _async_to_generator._(function*() {
                    yield new Promise((resolve, reject)=>require([
                            "./test"
                        ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject));
                })
            };
        }
    }
    let l = (_ref = _async_to_generator._(function*() {
        yield new Promise((resolve, reject)=>require([
                "./test"
            ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject));
    }), function() {
        return _ref.apply(this, arguments);
    });
});
