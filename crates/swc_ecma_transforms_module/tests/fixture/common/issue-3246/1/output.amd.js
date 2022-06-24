define([
    "bar"
], function(_bar) {
    "use strict";
    new Promise((resolve, reject)=>require([
            _bar.foo
        ], (m)=>resolve(_interopRequireWildcard(m)), reject));
});
