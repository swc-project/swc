var _class, _descriptor, _dec, _descriptor1, _dec1;
export let Example = ((_class = class Example {
    constructor(){
        _initializerDefineProperty(this, "bar", _descriptor, this);
        _initializerDefineProperty(this, "baz", _descriptor1, this);
    }
}) || _class, _dec = foo(), _dec1 = foo(), _descriptor = _applyDecoratedDescriptor(_class.prototype, "bar", [
    _dec
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return '1';
    }
}), _descriptor1 = _applyDecoratedDescriptor(_class.prototype, "baz", [
    _dec1
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return '2';
    }
}), _class);
