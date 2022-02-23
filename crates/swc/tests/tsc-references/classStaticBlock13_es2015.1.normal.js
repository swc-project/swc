function _classApplyDescriptorGet(receiver, descriptor) {
    if (descriptor.get) {
        return descriptor.get.call(receiver);
    }
    return descriptor.value;
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
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
}
// @target: esnext, es2022, es2015
// @useDefineForClassFields: true
class C {
    foo() {
        return _classStaticPrivateFieldSpecGet(C, C, _x);
    }
}
var _x = {
    writable: true,
    value: 123
};
var __ = {
    writable: true,
    value: (()=>{
        console.log(_classStaticPrivateFieldSpecGet(C, C, _x));
    })()
};
