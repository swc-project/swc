"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Cachier = exports.default = void 0;
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
_export(exports, {
    default: ()=>_default,
    Cachier: ()=>Cachier
});
var _default = new Cachier();
function Cachier(databaseName) {}
