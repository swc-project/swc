define("moduleId", [
    "require",
    "exports",
    "src"
], function(require, exports, _src) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "foo", {
        get: ()=>_src.foo,
        enumerable: true
    });
});
