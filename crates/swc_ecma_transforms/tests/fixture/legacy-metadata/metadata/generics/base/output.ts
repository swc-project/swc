class MyClass {
    constructor(private generic: Generic<A>, generic2: Generic<A, B>){}
    method(generic: Inter<A>, generic2: InterGen<A, B>) {}
}
_ts_decorate([
    Run,
    _ts_param(1, Arg()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Inter === "undefined" ? Object : Inter,
        typeof InterGen === "undefined" ? Object : InterGen
    ]),
    _ts_metadata("design:returntype", void 0)
], MyClass.prototype, "method", null);
MyClass = _ts_decorate([
    Decorate,
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Generic === "undefined" ? Object : Generic,
        typeof Generic === "undefined" ? Object : Generic
    ])
], MyClass);
