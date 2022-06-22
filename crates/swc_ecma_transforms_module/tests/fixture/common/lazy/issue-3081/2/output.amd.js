define([
    "require",
    "lib"
], function(require, _lib) {
    "use strict";
    function myFn() {
        (0, _lib.fn)();
    }
    class MyClass extends _lib.Klass {
    }
});
