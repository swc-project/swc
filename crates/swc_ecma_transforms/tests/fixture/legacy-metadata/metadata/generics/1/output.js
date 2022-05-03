let MyClass = class MyClass {
    constructor(private generic: Generic<A>, generic2: Generic<A, B>){}
};
MyClass = __decorate([
    Decorate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
        typeof Generic === "undefined" ? Object : Generic,
        typeof Generic === "undefined" ? Object : Generic
    ])
], MyClass);
