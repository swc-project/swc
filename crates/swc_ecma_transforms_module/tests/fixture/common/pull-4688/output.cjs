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
    format: ()=>format,
    default: ()=>defaultLocale
});
var format;
function defaultLocale(definition) {
    locale = formatLocale(definition);
    format = locale.format;
    return locale;
}
format = "123";
