define([
    "require"
], function(require) {
    "use strict";
    async function foo() {
        await new Promise((resolve, reject)=>require([
                "foo"
            ], (m)=>resolve(/*#__PURE__*/ _interopRequireWildcard(m)), reject));
    }
});
