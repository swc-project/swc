"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    Cachier: null,
    default: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    Cachier: function() {
        return Cachier;
    },
    default: function() {
        return _default;
    }
});
const _default = new Cachier();
function Cachier(databaseName) {}
