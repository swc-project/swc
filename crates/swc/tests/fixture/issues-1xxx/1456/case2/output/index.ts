"use strict";
var _tsDecorateMjs = require("@swc/helpers/lib/_ts_decorate.js");
var _tsMetadataMjs = require("@swc/helpers/lib/_ts_metadata.js");
var _tsParamMjs = require("@swc/helpers/lib/_ts_param.js");
// work
class MyClass1 {
    constructor(param1){}
}
MyClass1 = (0, _tsDecorateMjs.default)([
    (0, _tsParamMjs.default)(0, Inject()),
    (0, _tsMetadataMjs.default)("design:type", Function),
    (0, _tsMetadataMjs.default)("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass1);
class MyClass2 {
    constructor(param1, param2){
        this.param1 = param1;
    }
}
MyClass2 = (0, _tsDecorateMjs.default)([
    (0, _tsParamMjs.default)(0, Inject()),
    (0, _tsParamMjs.default)(1, Inject()),
    (0, _tsMetadataMjs.default)("design:type", Function),
    (0, _tsMetadataMjs.default)("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected,
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass2);
class MyClass3 {
    constructor(param1, param2){
        this.param2 = param2;
    }
}
MyClass3 = (0, _tsDecorateMjs.default)([
    (0, _tsParamMjs.default)(0, Inject()),
    (0, _tsParamMjs.default)(1, Inject()),
    (0, _tsMetadataMjs.default)("design:type", Function),
    (0, _tsMetadataMjs.default)("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected,
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass3);
