//// [test.ts]
"use strict";
exports, exports;
var _asyncToGenerator = require("@swc/helpers/lib/_async_to_generator.js").default;
require("@swc/helpers/lib/_class_call_check.js").default;
var _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default, _tsGenerator = require("@swc/helpers/lib/_ts_generator.js").default;
!function() {
    "use strict";
    function cl1() {}
    return cl1.prototype.m = function() {
        return _asyncToGenerator(function() {
            return _tsGenerator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            Promise.resolve().then(function() {
                                return _interopRequireWildcard(require("./test"));
                            })
                        ];
                    case 1:
                        return _state.sent(), [
                            2
                        ];
                }
            });
        })();
    }, cl1;
}();
