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
var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _interop_require_default = require("@swc/helpers/_/_interop_require_default");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
var _react = /*#__PURE__*/ _interop_require_default._(require("react"));
function Foo() {
    return call(/*#__PURE__*/ _async_to_generator._(function(e) {
        return _ts_generator._(this, function(_state) {
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
    }));
}
Foo.displayName = "Foo";
