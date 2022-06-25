"use strict";
const _tsDecorate = require("@swc/helpers/lib/_ts_decorate.js").default;
const _tsMetadata = require("@swc/helpers/lib/_ts_metadata.js").default;
const _tsParam = require("@swc/helpers/lib/_ts_param.js").default;
// work
class MyClass1 {
    constructor(param1){}
}
MyClass1 = _tsDecorate([
    _tsParam(0, Inject()),
    _tsMetadata("design:type", Function),
    _tsMetadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass1);
class MyClass2 {
    constructor(param1, param2){
        this.param1 = param1;
    }
}
MyClass2 = _tsDecorate([
    _tsParam(0, Inject()),
    _tsParam(1, Inject()),
    _tsMetadata("design:type", Function),
    _tsMetadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected,
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass2);
class MyClass3 {
    constructor(param1, param2){
        this.param2 = param2;
    }
}
MyClass3 = _tsDecorate([
    _tsParam(0, Inject()),
    _tsParam(1, Inject()),
    _tsMetadata("design:type", Function),
    _tsMetadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected,
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass3);
