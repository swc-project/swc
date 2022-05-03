class Injected {
}
class MyClass {
    constructor(parameter: Injected){}
}
MyClass = __decorate([
    __param(0, inject()),
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
    __param(0, demo()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
        String,
        void 0
    ])
], MyOtherClass.prototype, "methodUndecorated", null);
__decorate([
    decorate('named'),
    __param(0, inject()),
    __param(1, arg()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected,
        typeof Schema === "undefined" ? Object : Schema
    ])
], MyOtherClass.prototype, "method", null);
MyOtherClass = __decorate([
    __param(0, inject()),
    __param(1, inject('KIND')),
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
    __param(0, inject()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
        String
    ])
], DecoratedClass.prototype, "method", null);
DecoratedClass = __decorate([
    Decorate,
    __param(0, inject()),
    __param(1, inject()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected,
        typeof Injected === "undefined" ? Object : Injected
    ])
], DecoratedClass);
