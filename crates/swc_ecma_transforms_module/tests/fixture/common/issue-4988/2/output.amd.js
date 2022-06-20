define([
    "require",
    "exports",
    "vs/base/test/common/testUtils"
], function(require, exports, _testUtils) {
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
        flakySuite: function() {
            return flakySuite;
        }
    });
    _testUtils = _interopRequireWildcard(_testUtils);
    var flakySuite = _testUtils.flakySuite;
});
