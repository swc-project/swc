class Injected {
}
class MyClass {
    constructor(parameter: Injected){}
}
MyClass = _ts_decorate([
    _ts_param(0, inject()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyClass);
class MyOtherClass {
    constructor(private readonly parameter: Injected, otherParam: Injected){}
    methodUndecorated(param: string, otherParam) {}
    method(param: Injected, schema: Schema) {}
}
_ts_decorate([
    _ts_param(0, demo()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        void 0
    ]),
    _ts_metadata("design:returntype", void 0)
], MyOtherClass.prototype, "methodUndecorated", null);
_ts_decorate([
    decorate("named"),
    _ts_param(0, inject()),
    _ts_param(1, arg()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected,
        typeof Schema === "undefined" ? Object : Schema
    ]),
    _ts_metadata("design:returntype", void 0)
], MyOtherClass.prototype, "method", null);
MyOtherClass = _ts_decorate([
    _ts_param(0, inject()),
    _ts_param(1, inject("KIND")),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected,
        typeof Injected === "undefined" ? Object : Injected
    ])
], MyOtherClass);
class DecoratedClass {
    constructor(private readonly module: Injected, otherModule: Injected){}
    method(param: string) {}
}
_ts_decorate([
    decorate("example"),
    _ts_param(0, inject()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], DecoratedClass.prototype, "method", null);
DecoratedClass = _ts_decorate([
    Decorate,
    _ts_param(0, inject()),
    _ts_param(1, inject()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Injected === "undefined" ? Object : Injected,
        typeof Injected === "undefined" ? Object : Injected
    ])
], DecoratedClass);
