class Injected {
}
class MyClass {
    constructor(parameter: Injected){}
}
MyClass = __decorate([
    function(target, key) {
        return inject()(target, undefined, 0);
    },
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass);
class MyOtherClass {
    constructor(private readonly parameter: Injected, otherParam: Injected){}
    methodUndecorated(param: string, otherParam) {}
    method(param: Injected, schema: Schema) {}
}
__decorate([
    function(target, key) {
        return demo()(target, key, 0);
    },
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
        String,
        void 0
    ])
], MyOtherClass.prototype, "methodUndecorated", null);
__decorate([
    decorate('named'),
    function(target, key) {
        return inject()(target, key, 0);
    },
    function(target, key) {
        return arg()(target, key, 1);
    },
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected,
        typeof Schema === "undefined" ? Object : Schema
    ])
], MyOtherClass.prototype, "method", null);
MyOtherClass = __decorate([
    function(target, key) {
        return inject()(target, undefined, 0);
    },
    function(target, key) {
        return inject('KIND')(target, undefined, 1);
    },
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected,
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyOtherClass);
let DecoratedClass = class DecoratedClass {
    constructor(private readonly module: Injected, otherModule: Injected){}
    method(param: string) {}
};
__decorate([
    decorate('example'),
    function(target, key) {
        return inject()(target, key, 0);
    },
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
        String
    ])
], DecoratedClass.prototype, "method", null);
DecoratedClass = __decorate([
    Decorate,
    function(target, key) {
        return inject()(target, undefined, 0);
    },
    function(target, key) {
        return inject()(target, undefined, 1);
    },
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected,
        typeof Injected === "undefined" ? Object : Injected
    ])
], DecoratedClass);
