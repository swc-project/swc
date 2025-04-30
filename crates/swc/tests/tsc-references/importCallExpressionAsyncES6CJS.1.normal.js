//// [test.ts]
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
const _async_to_generator = require("@swc/helpers/_/_async_to_generator");
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
function fn() {
    return _async_to_generator._(function*() {
        const req = yield Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./test"))) // ONE
        ;
    })();
}
class cl1 {
    m() {
        return _async_to_generator._(function*() {
            const req = yield Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./test"))) // TWO
            ;
        })();
    }
}
const obj = {
    m: ()=>_async_to_generator._(function*() {
            const req = yield Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./test"))) // THREE
            ;
        })()
};
class cl2 {
    constructor(){
        this.p = {
            m: ()=>_async_to_generator._(function*() {
                    const req = yield Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./test"))) // FOUR
                    ;
                })()
        };
    }
}
const l = ()=>_async_to_generator._(function*() {
        const req = yield Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./test"))) // FIVE
        ;
    })();
