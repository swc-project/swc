"use strict";
function _foo() {
    const data = require("foo");
    _foo = function() {
        return data;
    };
    return data;
}
function use() {
    console.log(_foo().foo);
}
