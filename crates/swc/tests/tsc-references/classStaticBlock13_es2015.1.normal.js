function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
    return descriptor.value;
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
