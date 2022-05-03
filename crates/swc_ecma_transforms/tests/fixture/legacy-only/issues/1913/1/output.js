var _class, _descriptor;
let Store = ((_class = class Store {
    constructor(){
        _initializerDefineProperty(this, "doSomething", _descriptor, this);
        this.doSomething();
    }
}) || _class, _descriptor = _applyDecoratedDescriptor(_class.prototype, "doSomething", [
    action
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return ()=>{
            console.log('run');
        };
    }
}), _class);
