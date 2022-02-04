function _classStaticPrivateMethodGet(receiver, classConstructor, method) {
    return _classCheckPrivateStaticAccess(receiver, classConstructor), method;
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
}
class A {
    static test() {
        _classStaticPrivateMethodGet(this, A, fieldFunc).call(A);
        const func = _classStaticPrivateMethodGet(this, A, fieldFunc);
        func(), new (_classStaticPrivateMethodGet(this, A, fieldFunc))();
        const arr = [
            1,
            2
        ];
        _classStaticPrivateMethodGet(this, A, fieldFunc2).call(A, 0, ...arr, 3), new (_classStaticPrivateMethodGet(this, A, fieldFunc2))(0, ...arr, 3), _classStaticPrivateMethodGet(this, A, fieldFunc2).bind(A)`head${1}middle${2}tail`, _classStaticPrivateMethodGet(this.getClass(), A, fieldFunc2).bind(A)`test${1}and${2}`;
    }
    static getClass() {
        return A;
    }
}
var _x = {
    writable: !0,
    value: 1
};
function fieldFunc() {
    return function() {
        !function(receiver, classConstructor, descriptor, value) {
            if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
            if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
            return descriptor.value = value, value;
        }(A, A, _x, 10);
    };
}
function fieldFunc2() {
    return function(a, ...b) {};
}
