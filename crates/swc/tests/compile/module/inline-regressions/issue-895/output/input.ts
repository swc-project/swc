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
var _url = require("./url");
function setup(url, obj) {
    var _queryString = (0, _url.queryString)(obj);
    var _url1 = url + '?' + _queryString;
    return _url1;
}
