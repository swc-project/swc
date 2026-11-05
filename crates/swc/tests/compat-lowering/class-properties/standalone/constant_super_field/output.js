class A extends B {
    constructor(...args){
        super(...args), _define_property(this, "foo", super.bar);
    }
}
_define_property(A, "foo", B.bar);
