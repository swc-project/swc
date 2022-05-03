var _class, _descriptor;
let A = ((_class = class A {
    constructor();
    constructor(){
        _initializerDefineProperty(this, "x", _descriptor, this);
        console.log(123);
    }
}) || _class, _descriptor = _applyDecoratedDescriptor(_class.prototype, "x", [
    foo
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return 1;
    }
}), _class);
