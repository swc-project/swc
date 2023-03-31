"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return Foo;
    }
});
var _async_to_generator = require("@swc/helpers/lib/_async_to_generator.js").default;
var _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default;
var _ts_generator = require("@swc/helpers/lib/_ts_generator.js").default;
var _react = /*#__PURE__*/ _interop_require_default(require("react"));
function Foo() {
    return /*#__PURE__*/ _react.default.createElement("div", {
        onClick: /*#__PURE__*/ _async_to_generator(function(e) {
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            doSomething()
                        ];
                    case 1:
                        _state.sent();
                        return [
                            2
                        ];
                }
            });
        })
    });
}
Foo.displayName = "Foo";
