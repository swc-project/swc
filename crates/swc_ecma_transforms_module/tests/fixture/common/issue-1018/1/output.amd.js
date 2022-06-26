define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    async function foo() {
        await new Promise((resolve, reject)=>require([
                "foo"
            ], (m)=>resolve(_interopRequireWildcard(m)), reject));
    }
});
