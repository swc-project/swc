"use strict";
var _tsDecorateMjs = require("@swc/helpers/lib/_ts_decorate.js").default;
var _tsMetadataMjs = require("@swc/helpers/lib/_ts_metadata.js").default;
var _tsParamMjs = require("@swc/helpers/lib/_ts_param.js").default;
// not work
class MyClass1 {
    constructor(param1){
        this.param1 = param1;
    }
}
MyClass1 = _tsDecorateMjs([
    _tsParamMjs(0, Inject()),
    _tsMetadataMjs("design:type", Function),
    _tsMetadataMjs("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass1);
class MyClass2 {
    constructor(param1){
        this.param1 = param1;
    }
}
MyClass2 = _tsDecorateMjs([
    _tsParamMjs(0, Inject()),
    _tsMetadataMjs("design:type", Function),
    _tsMetadataMjs("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass2);
class MyClass3 {
    constructor(param1){
        this.param1 = param1;
    }
}
MyClass3 = _tsDecorateMjs([
    _tsParamMjs(0, Inject()),
    _tsMetadataMjs("design:type", Function),
    _tsMetadataMjs("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass3);
class MyClass4 {
    constructor(param1){
        this.param1 = param1;
    }
}
MyClass4 = _tsDecorateMjs([
    _tsParamMjs(0, Inject()),
    _tsMetadataMjs("design:type", Function),
    _tsMetadataMjs("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass4);
class MyClass5 {
    constructor(param1){
        this.param1 = param1;
    }
}
MyClass5 = _tsDecorateMjs([
    _tsParamMjs(0, Inject()),
    _tsMetadataMjs("design:type", Function),
    _tsMetadataMjs("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass5);
class MyClass6 {
    constructor(param1, param2){
        this.param1 = param1;
        this.param2 = param2;
    }
}
MyClass6 = _tsDecorateMjs([
    _tsParamMjs(0, Inject()),
    _tsParamMjs(1, Inject()),
    _tsMetadataMjs("design:type", Function),
    _tsMetadataMjs("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected,
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass6);
