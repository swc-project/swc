"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Foo;
var _async_to_generator = require("@swc/helpers/lib/_async_to_generator.js").default;
var _interop_require_default = require("@swc/helpers/lib/_interop_require_default.js").default;
var _regeneratorRuntime = _interop_require_default(require("regenerator-runtime"));
var _react = _interop_require_default(require("react"));
exports.default = void 0;
var swcHelpers = require("@swc/helpers");
var _regeneratorRuntime = swcHelpers.interopRequireDefault(require("regenerator-runtime"));
var _react = swcHelpers.interopRequireDefault(require("react"));
function Foo() {
    return /*#__PURE__*/ _react.default.createElement("div", {
        onClick: _async_to_generator(_regeneratorRuntime.default.mark(function _callee(e) {
            return _regeneratorRuntime.default.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _ctx.next = 2;
                        return doSomething();
                    case 2:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))
    });
}
Foo.displayName = "Foo";
var _default = Foo;
exports.default = _default;
