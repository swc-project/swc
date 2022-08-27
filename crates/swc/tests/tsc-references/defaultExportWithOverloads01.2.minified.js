//// [defaultExportWithOverloads01.ts]
"use strict";
function f() {
    for(var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: function() {
        return f;
    }
});
