//// [foo.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return _default;
    }
});
var _default = "./foo";
//// [index.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _asyncToGenerator = require("@swc/helpers/lib/_async_to_generator.js").default, _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default, _tsGenerator = require("@swc/helpers/lib/_ts_generator.js").default;
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    return (_foo = _asyncToGenerator(function() {
        return _tsGenerator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Promise.resolve().then(function() {
                            return _interopRequireWildcard(require("./foo"));
                        })
                    ];
                case 1:
                    return [
                        4,
                        Promise.resolve(_state.sent().default).then(function(p) {
                            return _interopRequireWildcard(require(p));
                        })
                    ];
                case 2:
                    return [
                        2,
                        _state.sent()
                    ];
            }
        });
    })).apply(this, arguments);
}
