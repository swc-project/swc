//// [test.ts]
"use strict";
function _export(target, all) {
    for(var name in all)all[name];
}
exports, exports;
const _asyncToGenerator = require("@swc/helpers/lib/_async_to_generator.js").default, _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
function fn() {
    return _fn.apply(this, arguments);
}
function _fn() {
    return (_fn = _asyncToGenerator(function*() {
        yield Promise.resolve().then(()=>_interopRequireWildcard(require("./test")));
    })).apply(this, arguments);
}
class cl1 {
    m() {
        return _asyncToGenerator(function*() {
            yield Promise.resolve().then(()=>_interopRequireWildcard(require("./test")));
        })();
    }
}
const obj = {
    m: _asyncToGenerator(function*() {
        yield Promise.resolve().then(()=>_interopRequireWildcard(require("./test")));
    })
};
class cl2 {
    constructor(){
        this.p = {
            m: _asyncToGenerator(function*() {
                yield Promise.resolve().then(()=>_interopRequireWildcard(require("./test")));
            })
        };
    }
}
const l = function() {
    var _ref = _asyncToGenerator(function*() {
        yield Promise.resolve().then(()=>_interopRequireWildcard(require("./test")));
    });
    return function() {
        return _ref.apply(this, arguments);
    };
}();
