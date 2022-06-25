"use strict";
function _lib() {
    const data = require("lib");
    _lib = function() {
        return data;
    };
    return data;
}
function myFn() {
    _lib().fn();
}
class MyClass extends _lib().Klass {
}
