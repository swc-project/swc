// work
var _ts_decorate = require("@swc/helpers/_/_ts_decorate");
var _ts_metadata = require("@swc/helpers/_/_ts_metadata");
var _ts_param = require("@swc/helpers/_/_ts_param");
class MyClass1 {
    constructor(param1){}
}
MyClass1 = _ts_decorate._([
    _ts_param._(0, Inject()),
    _ts_metadata._("design:type", Function),
    _ts_metadata._("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass1);
class MyClass2 {
    constructor(param1, param2){
        this.param1 = param1;
    }
}
MyClass2 = _ts_decorate._([
    _ts_param._(0, Inject()),
    _ts_param._(1, Inject()),
    _ts_metadata._("design:type", Function),
    _ts_metadata._("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected,
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass2);
class MyClass3 {
    constructor(param1, param2){
        this.param2 = param2;
    }
}
MyClass3 = _ts_decorate._([
    _ts_param._(0, Inject()),
    _ts_param._(1, Inject()),
    _ts_metadata._("design:type", Function),
    _ts_metadata._("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected,
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass3);
