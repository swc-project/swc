let MyClass = class MyClass {
    constructor(private generic: Generic<A>, generic2: Generic<A, B>){}
    method(generic: Inter<A>, generic2: InterGen<A, B>) {}
};
__decorate([
    Run,
    __param(1, Arg()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
        typeof Inter === "undefined" ? Object : Inter,
        typeof InterGen === "undefined" ? Object : InterGen
    ])
], MyClass.prototype, "method", null);
MyClass = __decorate([
    Decorate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
        typeof Generic === "undefined" ? Object : Generic,
        typeof Generic === "undefined" ? Object : Generic
    ])
], MyClass);
