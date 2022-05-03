var _class, _class1, _dec, _dec1, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class2, _dec8, _dec9, _dec10, _dec11;
class Injected {
}
var _dec12 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
    typeof Injected === "undefined" ? Object : Injected
]), _dec13 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec14 = function(target, key) {
    return inject()(target, undefined, 0);
};
let MyClass = _class = _dec14(_class = _dec13(_class = _dec12((_class = class MyClass {
    constructor(parameter: Injected){}
}) || _class) || _class) || _class) || _class;
var _dec15 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
    typeof Injected === "undefined" ? Object : Injected,
    typeof Injected === "undefined" ? Object : Injected
]), _dec16 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec17 = function(target, key) {
    return inject('KIND')(target, undefined, 1);
}, _dec18 = function(target, key) {
    return inject()(target, undefined, 0);
};
let MyOtherClass = _class1 = _dec18(_class1 = _dec17(_class1 = _dec16(_class1 = _dec15(((_class1 = class MyOtherClass {
    constructor(private readonly parameter: Injected, otherParam: Injected){}
    methodUndecorated(param: string, otherParam) {}
    method(param: Injected, schema: Schema) {}
}) || _class1, _dec = function(target, key) {
    return demo()(target, key, 0);
}, _dec1 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec2 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
    String,
    void 0
]), _applyDecoratedDescriptor(_class1.prototype, "methodUndecorated", [
    _dec,
    _dec1,
    _dec2
], Object.getOwnPropertyDescriptor(_class1.prototype, "methodUndecorated"), _class1.prototype), _dec3 = decorate('named'), _dec4 = function(target, key) {
    return inject()(target, key, 0);
}, _dec5 = function(target, key) {
    return arg()(target, key, 1);
}, _dec6 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec7 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
    typeof Injected === "undefined" ? Object : Injected,
    typeof Schema === "undefined" ? Object : Schema
]), _applyDecoratedDescriptor(_class1.prototype, "method", [
    _dec3,
    _dec4,
    _dec5,
    _dec6,
    _dec7
], Object.getOwnPropertyDescriptor(_class1.prototype, "method"), _class1.prototype), _class1)) || _class1) || _class1) || _class1) || _class1;
var _dec19 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
    typeof Injected === "undefined" ? Object : Injected,
    typeof Injected === "undefined" ? Object : Injected
]), _dec20 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec21 = function(target, key) {
    return inject()(target, undefined, 1);
}, _dec22 = function(target, key) {
    return inject()(target, undefined, 0);
};
let DecoratedClass = _class2 = Decorate(_class2 = _dec22(_class2 = _dec21(_class2 = _dec20(_class2 = _dec19(((_class2 = class DecoratedClass {
    constructor(private readonly module: Injected, otherModule: Injected){}
    method(param: string) {}
}) || _class2, _dec8 = decorate('example'), _dec9 = function(target, key) {
    return inject()(target, key, 0);
}, _dec10 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Function), _dec11 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:paramtypes", [
    String
]), _applyDecoratedDescriptor(_class2.prototype, "method", [
    _dec8,
    _dec9,
    _dec10,
    _dec11
], Object.getOwnPropertyDescriptor(_class2.prototype, "method"), _class2.prototype), _class2)) || _class2) || _class2) || _class2) || _class2) || _class2;
