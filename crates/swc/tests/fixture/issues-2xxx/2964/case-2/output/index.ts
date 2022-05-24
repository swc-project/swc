"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.downloadDocument = exports.badIstanbul = exports.noop = void 0;
var _object_without_properties = require("@swc/helpers/lib/_object_without_properties.js").default;
//top comment
const noop = ()=>{};
exports.noop = noop;
var /* istanbul ignore next */ badIstanbul = (test)=>{
    const { value  } = test, pixelParams = _object_without_properties(test, [
        "value"
    ]);
    console.log("fail");
};
/* istanbul ignore next: UI-5137 */ const downloadDocument = ()=>{
    console.log("fail");
};
exports.downloadDocument = downloadDocument;
exports.badIstanbul = badIstanbul;
