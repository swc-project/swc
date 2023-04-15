"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "bar", {
    enumerable: true,
    get: function() {
        return _foo.foo;
    }
});
const _foo = require("foo");
