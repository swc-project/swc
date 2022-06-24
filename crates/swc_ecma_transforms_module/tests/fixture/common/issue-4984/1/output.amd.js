define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "default", {
        get: ()=>MyClass,
        enumerable: true
    });
    const VALUE = "hello";
    class MyClass {
        static MEMBER = VALUE;
    }
});
