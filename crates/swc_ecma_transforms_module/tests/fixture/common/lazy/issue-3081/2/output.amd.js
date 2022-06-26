define([
    "require",
    "exports",
    "lib"
], function(require, exports, _lib) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function myFn() {
        (0, _lib.fn)();
    }
    class MyClass extends _lib.Klass {
    }
});
