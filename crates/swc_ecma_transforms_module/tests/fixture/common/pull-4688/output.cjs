"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
_export(exports, {
    default: ()=>defaultLocale,
    format: ()=>format
});
var format;
function defaultLocale(definition) {
    locale = formatLocale(definition);
    format = locale.format;
    return locale;
}
format = "123";
