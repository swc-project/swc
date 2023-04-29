class MyClass {
    constructor(param1: Injected){}
}
MyClass = _ts_decorate([
    _ts_param(0, Inject()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass);
