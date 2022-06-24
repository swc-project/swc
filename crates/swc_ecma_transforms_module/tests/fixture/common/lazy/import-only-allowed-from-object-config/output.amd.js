define([
    "./local",
    "external_test",
    "test"
], function(_local, _externalTest, _test) {
    "use strict";
    function use() {
        (0, _local.local)((0, _externalTest.external)(_test.test));
    }
});
