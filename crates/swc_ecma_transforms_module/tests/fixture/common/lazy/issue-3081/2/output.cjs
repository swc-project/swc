"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _lib() {
    const data = require("lib");
    _lib = function() {
        return data;
    };
    return data;
}
function myFn() {
    (0, _lib().fn)();
}
class MyClass extends _lib().Klass {
}
