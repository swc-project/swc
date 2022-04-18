"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.downloadDocument = exports.badIstanbul = exports.noop = void 0;
var swcHelpers = require("@swc/helpers");
//top comment
const noop = ()=>{};
exports.noop = noop;
var /* istanbul ignore next */ badIstanbul = (test)=>{
    const { value  } = test, pixelParams = swcHelpers.objectWithoutProperties(test, [
        "value"
    ]);
    console.log('fail');
};
/* istanbul ignore next: UI-5137 */ const downloadDocument = ()=>{
    console.log('fail');
};
exports.downloadDocument = downloadDocument;
exports.badIstanbul = badIstanbul;
