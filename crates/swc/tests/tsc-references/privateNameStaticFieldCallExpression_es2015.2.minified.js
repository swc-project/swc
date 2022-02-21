function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
    return descriptor.value;
}
class A {
    test() {
        var ref;
        _classStaticPrivateFieldSpecGet(A, A, _fieldFunc).call(A), null === (ref = _classStaticPrivateFieldSpecGet(A, A, _fieldFunc)) || void 0 === ref || ref.call(A);
        const func = _classStaticPrivateFieldSpecGet(A, A, _fieldFunc);
        func(), new (_classStaticPrivateFieldSpecGet(A, A, _fieldFunc))();
        const arr = [
            1,
            2
        ];
        _classStaticPrivateFieldSpecGet(A, A, _fieldFunc2).call(A, 0, ...arr, 3), new (_classStaticPrivateFieldSpecGet(A, A, _fieldFunc2))(0, ...arr, 3), _classStaticPrivateFieldSpecGet(A, A, _fieldFunc2).bind(A)`head${1}middle${2}tail`, _classStaticPrivateFieldSpecGet(this.getClass(), A, _fieldFunc2).bind(A)`test${1}and${2}`;
    }
    getClass() {
        return A;
    }
    constructor(){
        this.x = 1;
    }
}
var _fieldFunc = {
    writable: !0,
    value: function() {
        this.x = 10;
    }
}, _fieldFunc2 = {
    writable: !0,
    value: function(a, ...b) {}
};
