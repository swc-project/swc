import _class_static_private_field_spec_get from "@swc/helpers/src/_class_static_private_field_spec_get.mjs";
class A {
    test() {
        var ref;
        _class_static_private_field_spec_get(A, A, _fieldFunc).call(A), null === (ref = _class_static_private_field_spec_get(A, A, _fieldFunc)) || void 0 === ref || ref.call(A);
        let func = _class_static_private_field_spec_get(A, A, _fieldFunc);
        func(), new (_class_static_private_field_spec_get(A, A, _fieldFunc))();
        let arr = [
            1,
            2
        ];
        _class_static_private_field_spec_get(A, A, _fieldFunc2).call(A, 0, ...arr, 3), new (_class_static_private_field_spec_get(A, A, _fieldFunc2))(0, ...arr, 3), _class_static_private_field_spec_get(A, A, _fieldFunc2).bind(A)`head${1}middle${2}tail`, _class_static_private_field_spec_get(this.getClass(), A, _fieldFunc2).bind(A)`test${1}and${2}`;
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
