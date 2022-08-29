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
const _asyncToGenerator = require("@swc/helpers/lib/_async_to_generator.js").default;
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
function fn() {
    return _fn.apply(this, arguments);
}
function _fn() {
    _fn = _asyncToGenerator(function*() {
        const req = yield Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./test"))) // ONE
        ;
    });
    return _fn.apply(this, arguments);
}
class cl1 {
    m() {
        return _asyncToGenerator(function*() {
            const req = yield Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./test"))) // TWO
            ;
        })();
    }
}
const obj = {
    m: /*#__PURE__*/ _asyncToGenerator(function*() {
        const req = yield Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./test"))) // THREE
        ;
    })
};
class cl2 {
    constructor(){
        this.p = {
            m: /*#__PURE__*/ _asyncToGenerator(function*() {
                const req = yield Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./test"))) // FOUR
                ;
            })
        };
    }
}
const l = function() {
    var _ref = _asyncToGenerator(function*() {
        const req = yield Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./test"))) // FIVE
        ;
    });
    return function l() {
        return _ref.apply(this, arguments);
    };
}();
