//// [test.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
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
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: Object.getOwnPropertyDescriptor(all, name).get
});
let _async_to_generator = require("@swc/helpers/_/_async_to_generator"), _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
function fn() {
    return _async_to_generator._(function*() {
        yield Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./test")));
    })();
}
class cl1 {
    m() {
        return _async_to_generator._(function*() {
            yield Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./test")));
        })();
    }
}
let obj = {
    m: ()=>_async_to_generator._(function*() {
            yield Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./test")));
        })()
};
class cl2 {
    constructor(){
        this.p = {
            m: ()=>_async_to_generator._(function*() {
                    yield Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./test")));
                })()
        };
    }
}
let l = ()=>_async_to_generator._(function*() {
        yield Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./test")));
    })();
