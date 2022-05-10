class MyClass {
    constructor(param1: Injected){}
}
MyClass = __decorate([
    __param(0, Inject()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass);
