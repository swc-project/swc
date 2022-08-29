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
var _asyncToGenerator = require("@swc/helpers/lib/_async_to_generator.js").default;
var _interopRequireDefault = require("@swc/helpers/lib/_interop_require_default.js").default;
var _tsGenerator = require("@swc/helpers/lib/_ts_generator.js").default;
var _react = /*#__PURE__*/ _interopRequireDefault(require("react"));
function Foo() {
    return call(/*#__PURE__*/ _asyncToGenerator(function(e) {
        return _tsGenerator(this, function(_state) {
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
