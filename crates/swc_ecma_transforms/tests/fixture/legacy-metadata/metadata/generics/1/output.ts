class MyClass {
    constructor(private generic: Generic<A>, generic2: Generic<A, B>){}
}
MyClass = _ts_decorate([
    Decorate,
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Generic === "undefined" ? Object : Generic,
        typeof Generic === "undefined" ? Object : Generic
    ])
], MyClass);
