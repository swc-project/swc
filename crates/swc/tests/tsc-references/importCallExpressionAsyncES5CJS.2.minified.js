//// [test.ts]
exports, exports;
var _async_to_generator = require("@swc/helpers/_/_async_to_generator"), _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard"), _ts_generator = require("@swc/helpers/_/_ts_generator");
_async_to_generator._(function() {
    return _ts_generator._(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    Promise.resolve().then(function() {
                        return /*#__PURE__*/ _interop_require_wildcard._(require("./test"));
                    }) // FIVE
                ];
            case 1:
                return _state.sent(), [
                    2
                ];
        }
    });
});
