define([
    "require",
    "exports",
    "./url"
], function(require, exports, _url) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "setup", {
        enumerable: true,
        get: function() {
            return setup;
        }
    });
    function setup(url, obj) {
        const _queryString = (0, _url.queryString)(obj);
        const _url1 = url + "?" + _queryString;
        return _url1;
    }
});
