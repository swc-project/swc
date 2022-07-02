define([
    "require",
    "exports",
    "vs/base/test/common/testUtils"
], function(require, exports, _testUtils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "flakySuite", {
        enumerable: true,
        get: ()=>flakySuite
    });
    _testUtils = /*#__PURE__*/ _interopRequireWildcard(_testUtils);
    var flakySuite = _testUtils.flakySuite;
});
