"use strict";
var swcHelpers = require("@swc/helpers");
var _class, _descriptor, _dec, _dec1;
function MyDecorator(klass) {
    return ()=>{
        // do something
        console.log(klass);
    };
}
let MyClass = ((_class = class MyClass {
    constructor(){
        swcHelpers.initializerDefineProperty(this, "prop", _descriptor, this);
    }
}) || _class, _dec = MyDecorator(_class), _dec1 = typeof Reflect !== "undefined" && typeof Reflect.metadata === "function" && Reflect.metadata("design:type", String), _descriptor = swcHelpers.applyDecoratedDescriptor(_class.prototype, "prop", [
    _dec,
    _dec1
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
}), _class);
console.log(new MyClass());
