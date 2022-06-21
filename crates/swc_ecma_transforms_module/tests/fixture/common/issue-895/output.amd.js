define([
    "require",
    "exports",
    "./url"
], function(require, exports, _url) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function __export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            get: all[name],
            enumerable: true
        });
    }
    __export(exports, {
        setup: ()=>setup
    });
    function setup(url, obj) {
        const _queryString = (0, _url.queryString)(obj);
        const _url1 = url + "?" + _queryString;
        return _url1;
    }
});
