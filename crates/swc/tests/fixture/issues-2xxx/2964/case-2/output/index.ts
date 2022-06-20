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
var _objectWithoutPropertiesMjs = require("@swc/helpers/lib/_object_without_properties.js");
//top comment
const noop = ()=>{};
var /* istanbul ignore next */ badIstanbul = (test)=>{
    const { value  } = test, pixelParams = (0, _objectWithoutPropertiesMjs.default)(test, [
        "value"
    ]);
    console.log("fail");
};
/* istanbul ignore next: UI-5137 */ const downloadDocument = ()=>{
    console.log("fail");
};
