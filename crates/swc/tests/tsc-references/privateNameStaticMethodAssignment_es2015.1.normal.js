function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
    if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
    return value;
}
function _classStaticPrivateMethodGet(receiver, classConstructor, method1) {
    _classCheckPrivateStaticAccess(receiver, classConstructor);
    return method1;
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
}
// @target: es2015
class A3 {
    constructor(a, b){
        var _this_method;
        _classStaticPrivateFieldSpecSet(A3, A3, _method, ()=>{} // Error, not writable 
        );
        _classStaticPrivateFieldSpecSet(a, A3, _method, ()=>{}); // Error, not writable 
        _classStaticPrivateFieldSpecSet(b, A3, _method, ()=>{} //Error, not writable 
        );
        ({ x: _classStaticPrivateMethodGet(A3, A3, method)  } = {
            x: ()=>{}
        }); //Error, not writable 
        let x = _classStaticPrivateMethodGet(A3, A3, method);
        _classStaticPrivateFieldSpecSet(b, A3, _method, (_this_method = +_classStaticPrivateMethodGet(b, A3, method)) + 1), _this_method; //Error, not writable 
    }
}
function method() {}
