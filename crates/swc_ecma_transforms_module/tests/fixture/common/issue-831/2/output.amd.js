define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "myGenerator", {
        get: ()=>myGenerator,
        enumerable: true
    });
    function* myGenerator() {
        yield* [
            1,
            2,
            3
        ];
    }
});
