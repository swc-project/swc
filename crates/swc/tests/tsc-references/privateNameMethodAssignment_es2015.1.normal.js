function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
    return value;
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return fn;
}
function _classPrivateFieldDestructureSet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    var descriptor = privateMap.get(receiver);
    if (descriptor.set) {
        if (!("__destrObj" in descriptor)) {
            descriptor.__destrObj = {
                set value (v){
                    descriptor.set.call(receiver, v);
                }
            };
        }
        return descriptor.__destrObj;
    } else {
        if (!descriptor.writable) {
            throw new TypeError("attempted to set read only private field");
        }
        return descriptor;
    }
}
var _method = new WeakSet();
// @target: es2015
class A3 {
    constructor(a, b){
        var _b, _this_method;
        _method.add(this);
        _classPrivateFieldSet(this, _method, ()=>{} // Error, not writable 
        );
        _classPrivateFieldSet(a, _method, ()=>{}); // Error, not writable 
        _classPrivateFieldSet(b, _method, ()=>{} //Error, not writable 
        );
        ({ x: _classPrivateFieldDestructureSet(this, _method).value  } = {
            x: ()=>{}
        }); //Error, not writable 
        let x = _classPrivateMethodGet(this, _method, method);
        _classPrivateFieldSet(_b = b, _method, (_this_method = +_classPrivateMethodGet(_b, _method, method)) + 1), _this_method; //Error, not writable 
    }
}
function method() {}
