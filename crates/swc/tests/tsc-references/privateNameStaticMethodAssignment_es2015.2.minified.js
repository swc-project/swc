function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
    if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
    return descriptor.value = value, value;
}
function _classStaticPrivateMethodGet(receiver, classConstructor, method1) {
    return _classCheckPrivateStaticAccess(receiver, classConstructor), method1;
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
}
class A3 {
    constructor(a, b){
        _classStaticPrivateFieldSpecSet(A3, A3, _method, ()=>{}), _classStaticPrivateFieldSpecSet(a, A3, _method, ()=>{}), _classStaticPrivateFieldSpecSet(b, A3, _method, ()=>{}), ({ x: _classStaticPrivateMethodGet(A3, A3, method)  } = {
            x: ()=>{}
        }), _classStaticPrivateMethodGet(A3, A3, method), _classStaticPrivateFieldSpecSet(b, A3, _method, +_classStaticPrivateMethodGet(b, A3, method) + 1);
    }
}
function method() {}
