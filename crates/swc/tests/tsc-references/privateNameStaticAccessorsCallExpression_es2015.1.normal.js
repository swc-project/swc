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
    static test() {
        _classStaticPrivateFieldSpecGet(this, A, _fieldFunc).call(A);
        const func = _classStaticPrivateFieldSpecGet(this, A, _fieldFunc);
        func();
        new (_classStaticPrivateFieldSpecGet(this, A, _fieldFunc))();
        const arr = [
            1,
            2
        ];
        _classStaticPrivateFieldSpecGet(this, A, _fieldFunc2).call(A, 0, ...arr, 3);
        const b = new (_classStaticPrivateFieldSpecGet(this, A, _fieldFunc2))(0, ...arr, 3);
        const str = _classStaticPrivateFieldSpecGet(this, A, _fieldFunc2).bind(A)`head${1}middle${2}tail`;
        _classStaticPrivateFieldSpecGet(this.getClass(), A, _fieldFunc2).bind(A)`test${1}and${2}`;
    }
    static getClass() {
        return A;
    }
}
var _fieldFunc = {
    get: get_fieldFunc,
    set: void 0
};
var _fieldFunc2 = {
    get: get_fieldFunc2,
    set: void 0
};
var _x = {
    writable: true,
    value: 1
};
function get_fieldFunc() {
    return function() {
        _classStaticPrivateFieldSpecSet(A, A, _x, 10);
    };
}
function get_fieldFunc2() {
    return function(a, ...b) {};
}
