define([
    "require",
    "bar"
], function(require, _bar) {
    "use strict";
    new Promise(function(resolve, reject) {
        return require([
            _bar.foo
        ], function(m) {
            return resolve(_interopRequireWildcard(m));
        }, reject);
    });
});
