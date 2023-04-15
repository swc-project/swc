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
var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _async_to_generator._(function() {
        return _ts_generator._(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Promise.resolve().then(function() {
                            return /*#__PURE__*/ _interop_require_wildcard._(require("./foo"));
                        })
                    ];
                case 1:
                    return [
                        4,
                        Promise.resolve(_state.sent().default).then(function(p) {
                            return /*#__PURE__*/ _interop_require_wildcard._(require(p));
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
