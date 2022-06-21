"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "setup", {
    get: ()=>setup,
    enumerable: true
});
var _url = require("./url");
function setup(url, obj) {
    const _queryString = (0, _url.queryString)(obj);
    const _url1 = url + "?" + _queryString;
    return _url1;
}
