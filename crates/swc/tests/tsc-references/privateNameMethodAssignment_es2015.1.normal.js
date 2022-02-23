function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classApplyDescriptorDestructureSet(receiver, descriptor) {
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
function _classApplyDescriptorSet(receiver, descriptor, value) {
    if (descriptor.set) {
        descriptor.set.call(receiver, value);
    } else {
        if (!descriptor.writable) {
            throw new TypeError("attempted to set read only private field");
        }
        descriptor.value = value;
    }
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to " + action + " private field on non-instance");
    }
    return privateMap.get(receiver);
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
    _classApplyDescriptorSet(receiver, descriptor, value);
    return value;
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return fn;
}
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet);
    privateSet.add(obj);
}
function _classPrivateFieldDestructureSet(receiver, privateMap) {
    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
    return _classApplyDescriptorDestructureSet(receiver, descriptor);
}
var _method = new WeakSet();
// @target: es2015
class A3 {
    constructor(a, b){
        var _b, _this_method;
        _classPrivateMethodInit(this, _method);
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
