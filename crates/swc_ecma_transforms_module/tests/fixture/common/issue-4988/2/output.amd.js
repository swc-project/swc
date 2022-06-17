define([
    "require",
    "exports",
    "vs/base/test/common/testUtils"
], function(require, exports, _testUtils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _export(exports, {
        flakySuite: function() {
            return flakySuite;
        }
    });
    _testUtils = _interopRequireWildcard(_testUtils);
    var flakySuite = _testUtils.flakySuite;
});
