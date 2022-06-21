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
    badIstanbul: ()=>badIstanbul,
    downloadDocument: ()=>downloadDocument,
    noop: ()=>noop
});
const _objectWithoutPropertiesMjs = require("@swc/helpers/lib/_object_without_properties.js").default;
//top comment
const noop = ()=>{};
var /* istanbul ignore next */ badIstanbul = (test)=>{
    const { value  } = test, pixelParams = _objectWithoutPropertiesMjs(test, [
        "value"
    ]);
    console.log("fail");
};
/* istanbul ignore next: UI-5137 */ const downloadDocument = ()=>{
    console.log("fail");
};
