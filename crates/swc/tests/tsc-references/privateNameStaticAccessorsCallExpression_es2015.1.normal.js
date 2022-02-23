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
function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) {
    _classCheckPrivateStaticAccess(receiver, classConstructor);
    _classCheckPrivateStaticFieldDescriptor(descriptor, "set");
    _classApplyDescriptorSet(receiver, descriptor, value);
    return value;
}
function _classStaticPrivateMethodGet(receiver, classConstructor, method) {
    _classCheckPrivateStaticAccess(receiver, classConstructor);
    return method;
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
}
// @target: es2015
class A {
    static test() {
        _classStaticPrivateMethodGet(this, A, fieldFunc).call(A);
        const func = _classStaticPrivateMethodGet(this, A, fieldFunc);
        func();
        new (_classStaticPrivateMethodGet(this, A, fieldFunc))();
        const arr = [
            1,
            2
        ];
        _classStaticPrivateMethodGet(this, A, fieldFunc2).call(A, 0, ...arr, 3);
        const b = new (_classStaticPrivateMethodGet(this, A, fieldFunc2))(0, ...arr, 3);
        const str = _classStaticPrivateMethodGet(this, A, fieldFunc2).bind(A)`head${1}middle${2}tail`;
        _classStaticPrivateMethodGet(this.getClass(), A, fieldFunc2).bind(A)`test${1}and${2}`;
    }
    static getClass() {
        return A;
    }
}
var _x = {
    writable: true,
    value: 1
};
function fieldFunc() {
    return function() {
        _classStaticPrivateFieldSpecSet(A, A, _x, 10);
    };
}
function fieldFunc2() {
    return function(a, ...b) {};
}
