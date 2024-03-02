enum MyEnum {
    x = "xxx",
    y = "yyy"
}
class Xpto {
    value!: MyEnum;
}
_ts_decorate([
    Decorator(),
    _ts_metadata("design:type", String)
], Xpto.prototype, "value", void 0);
function Decorator() {
    return function(...args) {};
}
