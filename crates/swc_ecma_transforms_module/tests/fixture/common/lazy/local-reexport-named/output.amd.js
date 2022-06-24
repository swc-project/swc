define([
    "exports",
    "./foo"
], function(exports, _foo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "named", {
        get: ()=>_foo.named,
        enumerable: true
    });
});
