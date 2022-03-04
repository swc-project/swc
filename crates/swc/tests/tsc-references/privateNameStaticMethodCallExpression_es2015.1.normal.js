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
class AA {
    test() {
        _classStaticPrivateMethodGet(AA, AA, method).call(AA);
        const func = _classStaticPrivateMethodGet(AA, AA, method);
        func();
        new (_classStaticPrivateMethodGet(AA, AA, method))();
        const arr = [
            1,
            2
        ];
        _classStaticPrivateMethodGet(AA, AA, method2).call(AA, 0, ...arr, 3);
        const b = new (_classStaticPrivateMethodGet(AA, AA, method2))(0, ...arr, 3); //Error 
        const str = _classStaticPrivateMethodGet(AA, AA, method2).bind(AA)`head${1}middle${2}tail`;
        _classStaticPrivateMethodGet(AA.getClass(), AA, method2).bind(AA)`test${1}and${2}`;
        _classStaticPrivateMethodGet(AA.getClass(), AA, method2).call(AA, 0, ...arr, 3);
        const b2 = new (_classStaticPrivateMethodGet(AA.getClass(), AA, method2))(0, ...arr, 3); //Error 
        const str2 = _classStaticPrivateMethodGet(AA.getClass(), AA, method2).bind(AA)`head${1}middle${2}tail`;
    }
    static getClass() {
        return AA;
    }
}
AA.x = 1;
function method() {
    this.x = 10;
}
function method2(a, ...b) {}
