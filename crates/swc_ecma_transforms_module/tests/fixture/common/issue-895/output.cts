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
const _url = require("./url");
function setup(url, obj) {
    const _queryString = (0, _url.queryString)(obj);
    const _url1 = url + "?" + _queryString;
    return _url1;
}
