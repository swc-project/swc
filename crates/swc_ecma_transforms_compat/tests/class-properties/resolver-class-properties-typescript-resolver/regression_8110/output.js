const field = Symbol('field');
let _field = field;
class A {
    constructor(){
        _define_property(this, _field, 10);
    }
}
