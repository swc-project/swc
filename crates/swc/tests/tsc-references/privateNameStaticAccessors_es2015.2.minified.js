function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
    if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
    return descriptor.value = value, value;
}
function _classStaticPrivateMethodGet(receiver, classConstructor, method) {
    return _classCheckPrivateStaticAccess(receiver, classConstructor), method;
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
}
class A1 {
    constructor(name){
        _classStaticPrivateFieldSpecSet(A1, A1, _prop, ""), _classStaticPrivateFieldSpecSet(A1, A1, _roProp, ""), console.log(_classStaticPrivateMethodGet(A1, A1, prop)), console.log(_classStaticPrivateMethodGet(A1, A1, function() {
            return "";
        }));
    }
}
function prop() {
    return "";
}
function prop(param) {}
