"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Foo;
var swcHelpers = require("@swc/helpers");
var _react = swcHelpers.interopRequireDefault(require("react"));
var regeneratorRuntime = require("regenerator-runtime");
function Foo() {
    return(/*#__PURE__*/ _react.default.createElement("div", {
        onClick: swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee(e) {
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
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
    }));
}
Foo.displayName = "Foo";
