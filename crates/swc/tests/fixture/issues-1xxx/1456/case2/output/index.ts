"use strict";
var swcHelpers = require("@swc/helpers");
// work
class MyClass1 {
    constructor(param1){}
}
MyClass1 = swcHelpers.__decorate([
    function(target, key) {
        return Inject()(target, undefined, 0);
    },
    swcHelpers.__metadata("design:type", Function),
    swcHelpers.__metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass1);
class MyClass2 {
    constructor(param1, param2){
        this.param1 = param1;
    }
}
MyClass2 = swcHelpers.__decorate([
    function(target, key) {
        return Inject()(target, undefined, 0);
    },
    function(target, key) {
        return Inject()(target, undefined, 1);
    },
    swcHelpers.__metadata("design:type", Function),
    swcHelpers.__metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected,
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass2);
class MyClass3 {
    constructor(param1, param2){
        this.param2 = param2;
    }
}
MyClass3 = swcHelpers.__decorate([
    function(target, key) {
        return Inject()(target, undefined, 0);
    },
    function(target, key) {
        return Inject()(target, undefined, 1);
    },
    swcHelpers.__metadata("design:type", Function),
    swcHelpers.__metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected,
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass3);
