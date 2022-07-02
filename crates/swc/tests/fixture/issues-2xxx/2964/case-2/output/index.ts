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
    noop: ()=>noop,
    badIstanbul: ()=>badIstanbul,
    downloadDocument: ()=>downloadDocument
});
const _objectWithoutProperties = require("@swc/helpers/lib/_object_without_properties.js").default;
//top comment
const noop = ()=>{};
/* istanbul ignore next */ const badIstanbul = (test)=>{
    const { value  } = test, pixelParams = _objectWithoutProperties(test, [
        "value"
    ]);
    console.log("fail");
};
/* istanbul ignore next: UI-5137 */ const downloadDocument = ()=>{
    console.log("fail");
}; /*#__PURE__*/ 
