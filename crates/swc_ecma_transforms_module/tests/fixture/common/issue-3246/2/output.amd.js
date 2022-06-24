define([
    "bar"
], function(_bar) {
    "use strict";
    _bar = _interopRequireDefault(_bar);
    new Promise((resolve, reject)=>require([
            _bar.default
        ], (m)=>resolve(_interopRequireWildcard(m)), reject));
});
