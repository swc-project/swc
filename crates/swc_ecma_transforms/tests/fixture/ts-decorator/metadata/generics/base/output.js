var _class, _dec, _dec1, _dec2;
var _dec3 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
    typeof Generic === "undefined" ? Object : Generic,
    typeof Generic === "undefined" ? Object : Generic
]), _dec4 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function);
let MyClass = _class = Decorate(_class = _dec4(_class = _dec3(((_class = class MyClass {
    constructor(private generic: Generic<A>, generic2: Generic<A, B>){}
    method(generic: Inter<A>, generic2: InterGen<A, B>) {}
}) || _class, _dec = function(target, key) {
    return Arg()(target, key, 1);
}, _dec1 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec2 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
    typeof Inter === "undefined" ? Object : Inter,
    typeof InterGen === "undefined" ? Object : InterGen
]), _applyDecoratedDescriptor(_class.prototype, "method", [
    Run,
    _dec,
    _dec1,
    _dec2
], Object.getOwnPropertyDescriptor(_class.prototype, "method"), _class.prototype), _class)) || _class) || _class) || _class;
