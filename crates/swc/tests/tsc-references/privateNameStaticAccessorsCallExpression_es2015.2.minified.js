function _classCheckPrivateStaticFieldDescriptor(descriptor, action) {
    if (void 0 === descriptor) throw new TypeError("attempted to " + action + " private static field before its declaration");
}
function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    var receiver, descriptor;
    return _classCheckPrivateStaticAccess(receiver, classConstructor), _classCheckPrivateStaticFieldDescriptor(descriptor, "get"), descriptor.get ? descriptor.get.call(receiver) : descriptor.value;
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
}
class A {
    static test() {
        _classStaticPrivateFieldSpecGet(this, A, _fieldFunc).call(A);
        const func = _classStaticPrivateFieldSpecGet(this, A, _fieldFunc);
        func(), new (_classStaticPrivateFieldSpecGet(this, A, _fieldFunc))();
        const arr = [
            1,
            2
        ];
        _classStaticPrivateFieldSpecGet(this, A, _fieldFunc2).call(A, 0, ...arr, 3), new (_classStaticPrivateFieldSpecGet(this, A, _fieldFunc2))(0, ...arr, 3), _classStaticPrivateFieldSpecGet(this, A, _fieldFunc2).bind(A)`head${1}middle${2}tail`, _classStaticPrivateFieldSpecGet(this.getClass(), A, _fieldFunc2).bind(A)`test${1}and${2}`;
    }
    static getClass() {
        return A;
    }
}
var _fieldFunc = {
    get: function() {
        return function() {
            var receiver, classConstructor, descriptor, value;
            receiver = A, classConstructor = A, descriptor = _x, value = 10, _classCheckPrivateStaticAccess(receiver, classConstructor), _classCheckPrivateStaticFieldDescriptor(descriptor, "set"), (function(receiver, descriptor, value) {
                if (descriptor.set) descriptor.set.call(receiver, value);
                else {
                    if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
                    descriptor.value = value;
                }
            })(receiver, descriptor, value);
        };
    },
    set: void 0
}, _fieldFunc2 = {
    get: function() {
        return function(a, ...b) {};
    },
    set: void 0
}, _x = {
    writable: !0,
    value: 1
};
