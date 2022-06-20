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
    Cachier: ()=>Cachier,
    default: ()=>_default
});
var _default = new Cachier();
function Cachier(databaseName) {}
