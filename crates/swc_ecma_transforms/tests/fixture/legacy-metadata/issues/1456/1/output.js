class MyClass {
    constructor(param1: Injected){}
}
MyClass = __decorate([
    function(target, key) {
        return Inject()(target, undefined, 0);
    },
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass);
