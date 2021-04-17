var _class, _descriptor;
import { MyEnum } from "./enum";
var _dec = Decorator(), _dec1 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", String);
let Xpto = ((_class = class Xpto {
    constructor(){
        _initializerDefineProperty(this, "value", _descriptor, this);
    }
}) || _class, _descriptor = _applyDecoratedDescriptor(_class.prototype, "value", [
    _dec,
    _dec1
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: void 0
}), _class);
function Decorator() {
    return function(...args) {
    };
}
