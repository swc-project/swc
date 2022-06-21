"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function __export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
__export(exports, {
    default: function() {
        return Foo;
    }
});
var _asyncToGeneratorMjs = require("@swc/helpers/lib/_async_to_generator.js").default;
var _interopRequireDefaultMjs = require("@swc/helpers/lib/_interop_require_default.js").default;
var _regeneratorRuntime = _interopRequireDefaultMjs(require("regenerator-runtime"));
var _react = _interopRequireDefaultMjs(require("react"));
function Foo() {
    return call(_asyncToGeneratorMjs(_regeneratorRuntime.default.mark(function _callee(e) {
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
    })));
}
Foo.displayName = "Foo";
