"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "named", {
    get: ()=>_foo().named,
    enumerable: true
});
function _foo() {
    const data = require("foo");
    _foo = function() {
        return data;
    };
    return data;
}
