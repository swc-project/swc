define([
    "require",
    "bar"
], function(require, _bar) {
    "use strict";
    _bar = _interopRequireDefault(_bar);
    new Promise(function(resolve, reject) {
        return require([
            _bar.default
        ], function(m) {
            return resolve(_interopRequireWildcard(m));
        }, reject);
    });
});
