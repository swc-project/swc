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
    badIstanbul: function() {
        return badIstanbul;
    },
    downloadDocument: function() {
        return downloadDocument;
    },
    noop: function() {
        return noop;
    }
});
const _object_without_properties = require("@swc/helpers/_/_object_without_properties");
//top comment
const noop = ()=>{};
/* istanbul ignore next */ const badIstanbul = (test)=>{
    const { value } = test, pixelParams = _object_without_properties._(test, [
        "value"
    ]);
    console.log("fail");
};
/* istanbul ignore next: UI-5137 */ const downloadDocument = ()=>{
    console.log("fail");
};
