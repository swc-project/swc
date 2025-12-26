var _B;
class A extends (_B = B) {
    constructor(...args){
        super(...args);
        _define_property(this, "foo", super.bar);
    }
}
_define_property(A, "foo", _B.bar);
