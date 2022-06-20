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
    default: ()=>_class
});
var _tsDecorateMjs = require("@swc/helpers/lib/_ts_decorate.js");
function test(constructor) {
    console.log(constructor);
}
let _class = class _class {
};
_class = (0, _tsDecorateMjs.default)([
    test
], _class);
