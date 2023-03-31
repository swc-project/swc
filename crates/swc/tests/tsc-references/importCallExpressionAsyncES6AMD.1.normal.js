//// [test.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_async_to_generator.mjs",
    "@swc/helpers/src/_interop_require_wildcard.mjs"
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
        fn: ()=>fn,
        cl1: ()=>cl1,
        obj: ()=>obj,
        cl2: ()=>cl2,
        l: ()=>l
    });
    _async_to_generator = _async_to_generator.default;
    _interop_require_wildcard = _interop_require_wildcard.default;
    function fn() {
        return _fn.apply(this, arguments);
    }
    function _fn() {
        _fn = _async_to_generator(function*() {
            const req = yield new Promise((resolve, reject)=>require([
                    "./test"
                ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard(m)), reject)) // ONE
            ;
        });
        return _fn.apply(this, arguments);
    }
    class cl1 {
        m() {
            return _async_to_generator(function*() {
                const req = yield new Promise((resolve, reject)=>require([
                        "./test"
                    ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard(m)), reject)) // TWO
                ;
            })();
        }
    }
    const obj = {
        m: /*#__PURE__*/ _async_to_generator(function*() {
            const req = yield new Promise((resolve, reject)=>require([
                    "./test"
                ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard(m)), reject)) // THREE
            ;
        })
    };
    class cl2 {
        constructor(){
            this.p = {
                m: /*#__PURE__*/ _async_to_generator(function*() {
                    const req = yield new Promise((resolve, reject)=>require([
                            "./test"
                        ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard(m)), reject)) // FOUR
                    ;
                })
            };
        }
    }
    const l = function() {
        var _ref = _async_to_generator(function*() {
            const req = yield new Promise((resolve, reject)=>require([
                    "./test"
                ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard(m)), reject)) // FIVE
            ;
        });
        return function l() {
            return _ref.apply(this, arguments);
        };
    }();
});
