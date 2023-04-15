define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "default", {
        enumerable: true,
        get: function() {
            return MyClass;
        }
    });
    const VALUE = "hello";
    class MyClass {
        static MEMBER = VALUE;
    }
});
