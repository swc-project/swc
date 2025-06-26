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
            get: Object.getOwnPropertyDescriptor(all, name).get
        });
    }
    _export(exports, {
        get cl1 () {
            return cl1;
        },
        get cl2 () {
            return cl2;
        },
        get fn () {
            return fn;
        },
        get l () {
            return l;
        },
        get obj () {
            return obj;
        }
    });
    function fn() {
        return _async_to_generator._(function*() {
            const req = yield new Promise((resolve, reject)=>require([
                    "./test"
                ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject)) // ONE
            ;
        })();
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
        m: ()=>_async_to_generator._(function*() {
                const req = yield new Promise((resolve, reject)=>require([
                        "./test"
                    ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject)) // THREE
                ;
            })()
    };
    class cl2 {
        constructor(){
            this.p = {
                m: ()=>_async_to_generator._(function*() {
                        const req = yield new Promise((resolve, reject)=>require([
                                "./test"
                            ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject)) // FOUR
                        ;
                    })()
            };
        }
    }
    const l = ()=>_async_to_generator._(function*() {
            const req = yield new Promise((resolve, reject)=>require([
                    "./test"
                ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject)) // FIVE
            ;
        })();
});
