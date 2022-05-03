var _class, _descriptor, _dec;
const ThingDecorator: PropertyDecorator = ()=>{};
let Thing = ((_class = class Thing {
    constructor(){
        _initializerDefineProperty(this, "thing", _descriptor, this);
    }
}) || _class, _dec = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", Object), _descriptor = _applyDecoratedDescriptor(_class.prototype, "thing", [
    ThingDecorator,
    _dec
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
}), _class);
