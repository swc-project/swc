"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = exports.Cachier = void 0;
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    Cachier: ()=>Cachier,
    default: ()=>_default
});
var _default = new Cachier();
function Cachier(databaseName) {}
