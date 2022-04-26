"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Foo;
var swcHelpers = require("@swc/helpers");
var _regeneratorRuntime = swcHelpers.interopRequireDefault(require("regenerator-runtime"));
var _react = swcHelpers.interopRequireDefault(require("react"));
function Foo() {
    return /*#__PURE__*/ _react.default.createElement("div", {
        onClick: swcHelpers.asyncToGenerator(_regeneratorRuntime.default.mark(function _callee(e) {
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
