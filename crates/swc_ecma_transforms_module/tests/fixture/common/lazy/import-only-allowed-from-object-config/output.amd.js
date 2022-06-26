define([
    "require",
    "exports",
    "./local",
    "external_test",
    "test"
], function(require, exports, _local, _externalTest, _test) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function use() {
        (0, _local.local)((0, _externalTest.external)(_test.test));
    }
});
