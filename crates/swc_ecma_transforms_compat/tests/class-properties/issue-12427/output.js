var _m = /*#__PURE__*/ new WeakSet();
class A {
    go(other) {
        _class_private_method_get(this, _m, m).call(this).n++;
        ++_class_private_method_get(this, _m, m).call(this).n;
        _class_private_method_get(other, _m, m).call(other).n++;
        _class_private_method_get(this, _m, m).call(this).a.n++;
        _class_private_method_get(this, _m, m).call(this)[0]++;
        return this.o.n;
    }
    static go() {
        _class_static_private_method_get(this, A, s).call(A).n++;
        return this.o.n;
    }
    constructor(){
        _class_private_method_init(this, _m);
    }
}
function m() {
    return this.o ??= {
        n: 0
    };
}
function s() {
    return this.o ??= {
        n: 0
    };
}
