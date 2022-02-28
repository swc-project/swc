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
class A1 {
    constructor(name){
        _classStaticPrivateFieldSpecSet(A1, A1, _prop, ""), _classStaticPrivateFieldSpecSet(A1, A1, _roProp, ""), console.log(_classStaticPrivateFieldSpecGet(A1, A1, _prop)), console.log(_classStaticPrivateFieldSpecGet(A1, A1, _roProp));
    }
}
var _prop = {
    get: function() {
        return "";
    },
    set: function(param) {}
}, _roProp = {
    get: function() {
        return "";
    },
    set: void 0
};
