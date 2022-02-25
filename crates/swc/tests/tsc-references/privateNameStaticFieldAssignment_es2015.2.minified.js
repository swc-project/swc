function _classCheckPrivateStaticFieldDescriptor(descriptor, action) {
    if (void 0 === descriptor) throw new TypeError("attempted to " + action + " private static field before its declaration");
}
function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    var receiver, descriptor;
    return _classCheckPrivateStaticAccess(receiver, classConstructor), _classCheckPrivateStaticFieldDescriptor(descriptor, "get"), descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
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
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
}
class A {
    static getClass() {
        return A;
    }
    constructor(){
        _classStaticPrivateFieldSpecSet(A, A, _field, 1), _classStaticPrivateFieldSpecSet(A, A, _field, _classStaticPrivateFieldSpecGet(A, A, _field) + 2), _classStaticPrivateFieldSpecSet(A, A, _field, _classStaticPrivateFieldSpecGet(A, A, _field) - 3), _classStaticPrivateFieldSpecSet(A, A, _field, _classStaticPrivateFieldSpecGet(A, A, _field) / 4), _classStaticPrivateFieldSpecSet(A, A, _field, 5 * _classStaticPrivateFieldSpecGet(A, A, _field)), _classStaticPrivateFieldSpecSet(A, A, _field, Math.pow(_classStaticPrivateFieldSpecGet(A, A, _field), 6)), _classStaticPrivateFieldSpecSet(A, A, _field, _classStaticPrivateFieldSpecGet(A, A, _field) % 7), _classStaticPrivateFieldSpecSet(A, A, _field, _classStaticPrivateFieldSpecGet(A, A, _field) << 8), _classStaticPrivateFieldSpecSet(A, A, _field, _classStaticPrivateFieldSpecGet(A, A, _field) >> 9), _classStaticPrivateFieldSpecSet(A, A, _field, _classStaticPrivateFieldSpecGet(A, A, _field) >>> 10), _classStaticPrivateFieldSpecSet(A, A, _field, 11 & _classStaticPrivateFieldSpecGet(A, A, _field)), _classStaticPrivateFieldSpecSet(A, A, _field, 12 | _classStaticPrivateFieldSpecGet(A, A, _field)), _classStaticPrivateFieldSpecSet(A, A, _field, 13 ^ _classStaticPrivateFieldSpecGet(A, A, _field)), _classStaticPrivateFieldSpecSet(A.getClass(), A, _field, 1), _classStaticPrivateFieldSpecSet(A.getClass(), A, _field, _classStaticPrivateFieldSpecGet(A.getClass(), A, _field) + 2), _classStaticPrivateFieldSpecSet(A.getClass(), A, _field, _classStaticPrivateFieldSpecGet(A.getClass(), A, _field) - 3), _classStaticPrivateFieldSpecSet(A.getClass(), A, _field, _classStaticPrivateFieldSpecGet(A.getClass(), A, _field) / 4), _classStaticPrivateFieldSpecSet(A.getClass(), A, _field, 5 * _classStaticPrivateFieldSpecGet(A.getClass(), A, _field)), _classStaticPrivateFieldSpecSet(A.getClass(), A, _field, Math.pow(_classStaticPrivateFieldSpecGet(A.getClass(), A, _field), 6)), _classStaticPrivateFieldSpecSet(A.getClass(), A, _field, _classStaticPrivateFieldSpecGet(A.getClass(), A, _field) % 7), _classStaticPrivateFieldSpecSet(A.getClass(), A, _field, _classStaticPrivateFieldSpecGet(A.getClass(), A, _field) << 8), _classStaticPrivateFieldSpecSet(A.getClass(), A, _field, _classStaticPrivateFieldSpecGet(A.getClass(), A, _field) >> 9), _classStaticPrivateFieldSpecSet(A.getClass(), A, _field, _classStaticPrivateFieldSpecGet(A.getClass(), A, _field) >>> 10), _classStaticPrivateFieldSpecSet(A.getClass(), A, _field, 11 & _classStaticPrivateFieldSpecGet(A.getClass(), A, _field)), _classStaticPrivateFieldSpecSet(A.getClass(), A, _field, 12 | _classStaticPrivateFieldSpecGet(A.getClass(), A, _field)), _classStaticPrivateFieldSpecSet(A.getClass(), A, _field, 13 ^ _classStaticPrivateFieldSpecGet(A.getClass(), A, _field));
    }
}
var _field = {
    writable: !0,
    value: 0
};
