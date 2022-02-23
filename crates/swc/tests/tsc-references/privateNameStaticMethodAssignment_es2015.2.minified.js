function _classCheckPrivateStaticFieldDescriptor(descriptor, action) {
    if (void 0 === descriptor) throw new TypeError("attempted to " + action + " private static field before its declaration");
}
function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) {
    return _classCheckPrivateStaticAccess(receiver, classConstructor), _classCheckPrivateStaticFieldDescriptor(descriptor, "set"), !function(receiver, descriptor, value) {
        if (descriptor.set) descriptor.set.call(receiver, value);
        else {
            if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
            descriptor.value = value;
        }
    }(receiver, descriptor, value), value;
}
function _classStaticPrivateMethodGet(receiver, classConstructor, method1) {
    return _classCheckPrivateStaticAccess(receiver, classConstructor), method1;
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
}
class A3 {
    constructor(a, b){
        _classStaticPrivateFieldSpecSet(A3, A3, _method, ()=>{}), _classStaticPrivateFieldSpecSet(a, A3, _method, ()=>{}), _classStaticPrivateFieldSpecSet(b, A3, _method, ()=>{}), ({ x: (function(receiver, classConstructor, descriptor) {
            return _classCheckPrivateStaticAccess(receiver, classConstructor), _classCheckPrivateStaticFieldDescriptor(descriptor, "set"), (function(receiver, descriptor) {
                if (descriptor.set) return "__destrObj" in descriptor || (descriptor.__destrObj = {
                    set value (v){
                        descriptor.set.call(receiver, v);
                    }
                }), descriptor.__destrObj;
                if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
                return descriptor;
            })(receiver, descriptor);
        })(A3, _method).value  } = {
            x: ()=>{}
        }), _classStaticPrivateMethodGet(A3, A3, method), _classStaticPrivateFieldSpecSet(b, A3, _method, +_classStaticPrivateMethodGet(b, A3, method) + 1);
    }
}
function method() {}
