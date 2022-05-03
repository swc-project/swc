"use strict";
var swcHelpers = require("@swc/helpers");
// not work
class MyClass1 {
    constructor(param1){
        this.param1 = param1;
    }
}
swcHelpers.__decorate([
    function(target, key) {
        return Inject()(target, undefined, 0);
    },
    swcHelpers.__metadata("design:type", Function),
    swcHelpers.__metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass1);
class MyClass2 {
    constructor(param1){
        this.param1 = param1;
    }
}
swcHelpers.__decorate([
    function(target, key) {
        return Inject()(target, undefined, 0);
    },
    swcHelpers.__metadata("design:type", Function),
    swcHelpers.__metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass2);
class MyClass3 {
    constructor(param1){
        this.param1 = param1;
    }
}
swcHelpers.__decorate([
    function(target, key) {
        return Inject()(target, undefined, 0);
    },
    swcHelpers.__metadata("design:type", Function),
    swcHelpers.__metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass3);
class MyClass4 {
    constructor(param1){
        this.param1 = param1;
    }
}
swcHelpers.__decorate([
    function(target, key) {
        return Inject()(target, undefined, 0);
    },
    swcHelpers.__metadata("design:type", Function),
    swcHelpers.__metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass4);
class MyClass5 {
    constructor(param1){
        this.param1 = param1;
    }
}
swcHelpers.__decorate([
    function(target, key) {
        return Inject()(target, undefined, 0);
    },
    swcHelpers.__metadata("design:type", Function),
    swcHelpers.__metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass5);
class MyClass6 {
    constructor(param1, param2){
        this.param1 = param1;
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
    swcHelpers.__metadata("design:type", Function),
    swcHelpers.__metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected,
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass6);
