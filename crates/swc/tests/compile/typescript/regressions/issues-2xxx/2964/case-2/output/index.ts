"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get badIstanbul () {
        return badIstanbul;
    },
    get downloadDocument () {
        return downloadDocument;
    },
    get noop () {
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
