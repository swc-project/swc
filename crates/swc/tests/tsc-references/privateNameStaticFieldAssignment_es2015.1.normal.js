function _classApplyDescriptorGet(receiver, descriptor) {
    if (descriptor.get) {
        return descriptor.get.call(receiver);
    }
    return descriptor.value;
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
function _classCheckPrivateStaticFieldDescriptor(descriptor, action) {
    if (descriptor === undefined) {
        throw new TypeError("attempted to " + action + " private static field before its declaration");
    }
}
function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    _classCheckPrivateStaticAccess(receiver, classConstructor);
    _classCheckPrivateStaticFieldDescriptor(descriptor, "get");
    return _classApplyDescriptorGet(receiver, descriptor);
}
function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) {
    _classCheckPrivateStaticAccess(receiver, classConstructor);
    _classCheckPrivateStaticFieldDescriptor(descriptor, "set");
    _classApplyDescriptorSet(receiver, descriptor, value);
    return value;
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
}
// @target: es2015
class A {
    static getClass() {
        return A;
    }
    constructor(){
        var _A, _A1, _A2, _A3, _A4, _A5, _A6, _A7, _A8, _A9, _A10, _A11, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _ref10, _ref11;
        _classStaticPrivateFieldSpecSet(A, A, _field, 1);
        _classStaticPrivateFieldSpecSet(_A = A, A, _field, _classStaticPrivateFieldSpecGet(A, A, _field) + 2);
        _classStaticPrivateFieldSpecSet(_A1 = A, A, _field, _classStaticPrivateFieldSpecGet(A, A, _field) - 3);
        _classStaticPrivateFieldSpecSet(_A2 = A, A, _field, _classStaticPrivateFieldSpecGet(A, A, _field) / 4);
        _classStaticPrivateFieldSpecSet(_A3 = A, A, _field, _classStaticPrivateFieldSpecGet(A, A, _field) * 5);
        _classStaticPrivateFieldSpecSet(_A4 = A, A, _field, Math.pow(_classStaticPrivateFieldSpecGet(A, A, _field), 6));
        _classStaticPrivateFieldSpecSet(_A5 = A, A, _field, _classStaticPrivateFieldSpecGet(A, A, _field) % 7);
        _classStaticPrivateFieldSpecSet(_A6 = A, A, _field, _classStaticPrivateFieldSpecGet(A, A, _field) << 8);
        _classStaticPrivateFieldSpecSet(_A7 = A, A, _field, _classStaticPrivateFieldSpecGet(A, A, _field) >> 9);
        _classStaticPrivateFieldSpecSet(_A8 = A, A, _field, _classStaticPrivateFieldSpecGet(A, A, _field) >>> 10);
        _classStaticPrivateFieldSpecSet(_A9 = A, A, _field, _classStaticPrivateFieldSpecGet(A, A, _field) & 11);
        _classStaticPrivateFieldSpecSet(_A10 = A, A, _field, _classStaticPrivateFieldSpecGet(A, A, _field) | 12);
        _classStaticPrivateFieldSpecSet(_A11 = A, A, _field, _classStaticPrivateFieldSpecGet(A, A, _field) ^ 13);
        _classStaticPrivateFieldSpecSet(A.getClass(), A, _field, 1);
        _classStaticPrivateFieldSpecSet(_ref = A.getClass(), A, _field, _classStaticPrivateFieldSpecGet(A.getClass(), A, _field) + 2);
        _classStaticPrivateFieldSpecSet(_ref1 = A.getClass(), A, _field, _classStaticPrivateFieldSpecGet(A.getClass(), A, _field) - 3);
        _classStaticPrivateFieldSpecSet(_ref2 = A.getClass(), A, _field, _classStaticPrivateFieldSpecGet(A.getClass(), A, _field) / 4);
        _classStaticPrivateFieldSpecSet(_ref3 = A.getClass(), A, _field, _classStaticPrivateFieldSpecGet(A.getClass(), A, _field) * 5);
        _classStaticPrivateFieldSpecSet(_ref4 = A.getClass(), A, _field, Math.pow(_classStaticPrivateFieldSpecGet(A.getClass(), A, _field), 6));
        _classStaticPrivateFieldSpecSet(_ref5 = A.getClass(), A, _field, _classStaticPrivateFieldSpecGet(A.getClass(), A, _field) % 7);
        _classStaticPrivateFieldSpecSet(_ref6 = A.getClass(), A, _field, _classStaticPrivateFieldSpecGet(A.getClass(), A, _field) << 8);
        _classStaticPrivateFieldSpecSet(_ref7 = A.getClass(), A, _field, _classStaticPrivateFieldSpecGet(A.getClass(), A, _field) >> 9);
        _classStaticPrivateFieldSpecSet(_ref8 = A.getClass(), A, _field, _classStaticPrivateFieldSpecGet(A.getClass(), A, _field) >>> 10);
        _classStaticPrivateFieldSpecSet(_ref9 = A.getClass(), A, _field, _classStaticPrivateFieldSpecGet(A.getClass(), A, _field) & 11);
        _classStaticPrivateFieldSpecSet(_ref10 = A.getClass(), A, _field, _classStaticPrivateFieldSpecGet(A.getClass(), A, _field) | 12);
        _classStaticPrivateFieldSpecSet(_ref11 = A.getClass(), A, _field, _classStaticPrivateFieldSpecGet(A.getClass(), A, _field) ^ 13);
    }
}
var _field = {
    writable: true,
    value: 0
};
