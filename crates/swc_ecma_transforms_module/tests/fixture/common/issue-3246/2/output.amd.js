define([
    "exports",
    "bar"
], function(exports, _bar) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _bar = _interopRequireDefault(_bar);
    new Promise((resolve, reject)=>require([
            _bar.default
        ], (m)=>resolve(_interopRequireWildcard(m)), reject));
});
