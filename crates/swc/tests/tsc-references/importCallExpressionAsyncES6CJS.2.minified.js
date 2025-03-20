//// [test.ts]
var _ref;
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
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
const _async_to_generator = require("@swc/helpers/_/_async_to_generator"), _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
function fn() {
    return _fn.apply(this, arguments);
}
function _fn() {
    return (_fn = _async_to_generator._(function*() {
        yield Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./test")));
    })).apply(this, arguments);
}
class cl1 {
    m() {
        return _async_to_generator._(function*() {
            yield Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./test")));
        })();
    }
}
const obj = {
    m: /*#__PURE__*/ _async_to_generator._(function*() {
        yield Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./test")));
    })
};
class cl2 {
    constructor(){
        this.p = {
            m: /*#__PURE__*/ _async_to_generator._(function*() {
                yield Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./test")));
            })
        };
    }
}
const l = (_ref = _async_to_generator._(function*() {
    yield Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard._(require("./test")));
}), function() {
    return _ref.apply(this, arguments);
});
