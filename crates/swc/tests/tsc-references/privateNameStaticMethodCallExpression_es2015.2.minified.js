function _classStaticPrivateMethodGet(receiver, classConstructor, method1) {
    return _classCheckPrivateStaticAccess(receiver, classConstructor), method1;
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
}
class AA {
    test() {
        _classStaticPrivateMethodGet(AA, AA, method).call(AA);
        const func = _classStaticPrivateMethodGet(AA, AA, method);
        func(), new (_classStaticPrivateMethodGet(AA, AA, method))();
        const arr = [
            1,
            2
        ];
        _classStaticPrivateMethodGet(AA, AA, method2).call(AA, 0, ...arr, 3), new (_classStaticPrivateMethodGet(AA, AA, method2))(0, ...arr, 3), _classStaticPrivateMethodGet(AA, AA, method2).bind(AA)`head${1}middle${2}tail`, _classStaticPrivateMethodGet(AA.getClass(), AA, method2).bind(AA)`test${1}and${2}`, _classStaticPrivateMethodGet(AA.getClass(), AA, method2).call(AA, 0, ...arr, 3), new (_classStaticPrivateMethodGet(AA.getClass(), AA, method2))(0, ...arr, 3), _classStaticPrivateMethodGet(AA.getClass(), AA, method2).bind(AA)`head${1}middle${2}tail`;
    }
    static getClass() {
        return AA;
    }
}
function method() {
    this.x = 10;
}
function method2(a, ...b) {}
AA.x = 1;
