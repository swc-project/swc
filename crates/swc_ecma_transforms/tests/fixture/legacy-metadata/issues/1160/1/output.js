enum MyEnum {
    x = "xxx",
    y = "yyy"
}
class Xpto {
    value: MyEnum;
}
__decorate([
    Decorator(),
    __metadata("design:type", String)
], Xpto.prototype, "value", void 0);
function Decorator() {
    return function(...args) {};
}
