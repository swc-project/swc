define([
    "exports",
    "bar"
], function(exports, _bar) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    new Promise((resolve, reject)=>require([
            `world/${(0, _bar.foo)(baz)}.js`
        ], (m)=>resolve(_interopRequireWildcard(m)), reject));
});
