define([
    "require",
    "bar"
], function(require, _bar) {
    "use strict";
    new Promise((resolve, reject)=>require([
            `world/${(0, _bar.foo)(baz)}.js`
        ], (m)=>resolve(_interopRequireWildcard(m)), reject));
});
