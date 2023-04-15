"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    bar: null,
    default: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    bar: function() {
        return bar;
    },
    default: function() {
        return foo;
    }
});
var foo, bar;
