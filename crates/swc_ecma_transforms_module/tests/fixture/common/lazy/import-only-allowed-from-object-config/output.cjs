"use strict";
const _local = require("./local");
const _externalTest = require("external_test");
function _test() {
    const data = require("test");
    _test = function() {
        return data;
    };
    return data;
}
function use() {
    (0, _local.local)((0, _externalTest.external)(_test().test));
}
