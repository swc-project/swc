define("moduleId", [
    "exports",
    "src"
], function(exports, _src) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "foo", {
        get: ()=>_src.foo,
        enumerable: true
    });
});
