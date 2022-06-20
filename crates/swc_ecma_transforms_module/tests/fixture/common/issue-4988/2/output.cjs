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
var _testUtils = _interopRequireWildcard(require("vs/base/test/common/testUtils"));
var flakySuite = _testUtils.flakySuite;
