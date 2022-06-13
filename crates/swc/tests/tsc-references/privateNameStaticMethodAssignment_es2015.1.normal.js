import _class_static_private_field_spec_set from "@swc/helpers/src/_class_static_private_field_spec_set.mjs";
import _class_static_private_field_update from "@swc/helpers/src/_class_static_private_field_update.mjs";
import _class_static_private_field_destructure from "@swc/helpers/src/_class_static_private_field_destructure.mjs";
import _class_static_private_method_get from "@swc/helpers/src/_class_static_private_method_get.mjs";
// @target: es2015
class A3 {
    constructor(a, b){
        _class_static_private_field_spec_set(A3, A3, _method, ()=>{} // Error, not writable 
        );
        _class_static_private_field_spec_set(a, A3, _method, ()=>{}); // Error, not writable 
        _class_static_private_field_spec_set(b, A3, _method, ()=>{} //Error, not writable 
        );
        ({ x: _class_static_private_field_destructure(A3, A3, _method).value  } = {
            x: ()=>{}
        }); //Error, not writable 
        let x = _class_static_private_method_get(A3, A3, method);
        _class_static_private_field_update(b, A3, _method).value++ //Error, not writable 
        ;
    }
}
function method() {}
