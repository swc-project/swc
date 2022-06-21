"use strict";
function _lib() {
    var data = require("lib");
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
