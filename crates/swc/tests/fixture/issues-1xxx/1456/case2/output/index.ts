"use strict";
var _ts_decorate = require("@swc/helpers/lib/_ts_decorate.js").default;
var _ts_metadata = require("@swc/helpers/lib/_ts_metadata.js").default;
var _ts_param = require("@swc/helpers/lib/_ts_param.js").default;
// work
class MyClass1 {
    constructor(param1){}
}
MyClass1 = _ts_decorate([
    _ts_param(0, Inject()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass1);
class MyClass2 {
    constructor(param1, param2){
        this.param1 = param1;
    }
}
MyClass2 = _ts_decorate([
    _ts_param(0, Inject()),
    _ts_param(1, Inject()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected,
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass2);
class MyClass3 {
    constructor(param1, param2){
        this.param2 = param2;
    }
}
MyClass3 = _ts_decorate([
    _ts_param(0, Inject()),
    _ts_param(1, Inject()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected,
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass3);
