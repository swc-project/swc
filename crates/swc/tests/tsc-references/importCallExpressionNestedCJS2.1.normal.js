//// [foo.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
var _default = "./foo";
//// [index.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _async_to_generator = require("@swc/helpers/lib/_async_to_generator.js").default;
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _ts_generator = require("@swc/helpers/lib/_ts_generator.js").default;
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Promise.resolve().then(function() {
                            return /*#__PURE__*/ _interop_require_wildcard(require("./foo"));
                        })
                    ];
                case 1:
                    return [
                        4,
                        Promise.resolve(_state.sent().default).then(function(p) {
                            return /*#__PURE__*/ _interop_require_wildcard(require(p));
                        })
                    ];
                case 2:
                    return [
                        2,
                        _state.sent()
                    ];
            }
        });
    });
    return _foo.apply(this, arguments);
}
