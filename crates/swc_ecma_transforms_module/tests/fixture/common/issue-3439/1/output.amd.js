define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "a", {
        enumerable: true,
        get: ()=>a
    });
    let a = 1;
    a = 2;
    use(a = 3);
    ({ a =4  } = {});
});
