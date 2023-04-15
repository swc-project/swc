"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    get: function() {
        return get;
    },
    default: function() {
        return _default;
    }
});
function get(key) {
    console.log(key);
}
const _default = a;
