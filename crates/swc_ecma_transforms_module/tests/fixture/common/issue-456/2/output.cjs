"use strict";
Object.defineProperty(exports, "foo", {
    enumerable: true,
    get: function() {
        return foo;
    }
});
const _path = require("path");
const foo = function() {
    var e = 1;
    return A(e, {}), e;
}();
