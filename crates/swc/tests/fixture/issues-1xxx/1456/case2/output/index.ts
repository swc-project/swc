"use strict";
var swcHelpers = require("@swc/helpers");
// work
class MyClass1 {
    constructor(param1){}
}
swcHelpers.__decorate([
    function(target, key) {
        return Inject()(target, undefined, 0);
    },
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function),
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass1);
class MyClass2 {
    constructor(param1, param2){
        this.param1 = param1;
    }
}
swcHelpers.__decorate([
    function(target, key) {
        return Inject()(target, undefined, 0);
    },
    function(target, key) {
        return Inject()(target, undefined, 1);
    },
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function),
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected,
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass2);
class MyClass3 {
    constructor(param1, param2){
        this.param2 = param2;
    }
}
swcHelpers.__decorate([
    function(target, key) {
        return Inject()(target, undefined, 0);
    },
    function(target, key) {
        return Inject()(target, undefined, 1);
    },
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function),
    typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected,
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass3);
