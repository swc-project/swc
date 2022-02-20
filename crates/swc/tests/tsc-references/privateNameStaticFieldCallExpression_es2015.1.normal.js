function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
    return descriptor.value;
}
// @target: es2015
class A {
    test() {
        var ref;
        _classStaticPrivateFieldSpecGet(A, A, _fieldFunc).call(A);
        (ref = _classStaticPrivateFieldSpecGet(A, A, _fieldFunc)) === null || ref === void 0 ? void 0 : ref.call(A);
        const func = _classStaticPrivateFieldSpecGet(A, A, _fieldFunc);
        func();
        new (_classStaticPrivateFieldSpecGet(A, A, _fieldFunc))();
        const arr = [
            1,
            2
        ];
        _classStaticPrivateFieldSpecGet(A, A, _fieldFunc2).call(A, 0, ...arr, 3);
        const b = new (_classStaticPrivateFieldSpecGet(A, A, _fieldFunc2))(0, ...arr, 3);
        const str = _classStaticPrivateFieldSpecGet(A, A, _fieldFunc2).bind(A)`head${1}middle${2}tail`;
        _classStaticPrivateFieldSpecGet(this.getClass(), A, _fieldFunc2).bind(A)`test${1}and${2}`;
    }
    getClass() {
        return A;
    }
    constructor(){
        this.x = 1;
    }
}
var _fieldFunc = {
    writable: true,
    value: function() {
        this.x = 10;
    }
};
var _fieldFunc2 = {
    writable: true,
    value: function(a, ...b) {}
};
