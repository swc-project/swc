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
var _url = require("./url");
function setup(url, obj) {
    const _queryString = (0, _url.queryString)(obj);
    const _url1 = url + "?" + _queryString;
    return _url1;
}
