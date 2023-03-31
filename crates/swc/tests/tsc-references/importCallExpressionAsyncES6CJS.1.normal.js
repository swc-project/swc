//// [test.ts]
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
const _async_to_generator = require("@swc/helpers/lib/_async_to_generator.js").default;
const _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
function fn() {
    return _fn.apply(this, arguments);
}
function _fn() {
    _fn = _async_to_generator(function*() {
        const req = yield Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./test"))) // ONE
        ;
    });
    return _fn.apply(this, arguments);
}
class cl1 {
    m() {
        return _async_to_generator(function*() {
            const req = yield Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./test"))) // TWO
            ;
        })();
    }
}
const obj = {
    m: /*#__PURE__*/ _async_to_generator(function*() {
        const req = yield Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./test"))) // THREE
        ;
    })
};
class cl2 {
    constructor(){
        this.p = {
            m: /*#__PURE__*/ _async_to_generator(function*() {
                const req = yield Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./test"))) // FOUR
                ;
            })
        };
    }
}
const l = function() {
    var _ref = _async_to_generator(function*() {
        const req = yield Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("./test"))) // FIVE
        ;
    });
    return function l() {
        return _ref.apply(this, arguments);
    };
}();
