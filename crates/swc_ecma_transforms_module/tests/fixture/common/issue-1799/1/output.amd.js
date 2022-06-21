define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "default", {
        get: ()=>Foo,
        enumerable: true
    });
    function Foo() {
        return 500;
    }
});
