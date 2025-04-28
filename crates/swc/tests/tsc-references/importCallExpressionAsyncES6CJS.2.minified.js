//// [test.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
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
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: all[name]
});
const _async_to_generator = require("@swc/helpers/_/_async_to_generator"), _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
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
const obj = {
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
const l = ()=>_async_to_generator._(function*() {
        yield Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./test")));
    })();
