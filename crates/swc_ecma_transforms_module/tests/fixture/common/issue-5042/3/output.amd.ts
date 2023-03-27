define([
    "require",
    "exports",
    "vs/base/test/common/testUtils"
], function(require, exports, _test_utils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "flakySuite", {
        enumerable: true,
        get: ()=>flakySuite
    });
    _test_utils = /*#__PURE__*/ _interop_require_wildcard(_test_utils);
    var flakySuite = _test_utils.flakySuite;
});
