function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
    return descriptor.value;
}
// @useDefineForClassFields: false
// @target: es2015
class C {
}
var _x = {
    writable: true,
    value: 1
};
var __ = {
    writable: true,
    value: (()=>{
        _classStaticPrivateFieldSpecGet(C, C, _x);
    })()
};
