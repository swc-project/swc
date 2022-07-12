// @target: es2015
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
import _class_private_field_update from "@swc/helpers/src/_class_private_field_update.mjs";
import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
import _class_private_field_destructure from "@swc/helpers/src/_class_private_field_destructure.mjs";
var _method = /*#__PURE__*/ new WeakSet();
class A3 {
    constructor(a, b){
        _class_private_method_init(this, _method);
        _class_private_field_set(this, _method, ()=>{} // Error, not writable 
        );
        _class_private_field_set(a, _method, ()=>{}); // Error, not writable 
        _class_private_field_set(b, _method, ()=>{} //Error, not writable 
        );
        ({ x: _class_private_field_destructure(this, _method).value  } = {
            x: ()=>{}
        }); //Error, not writable 
        let x = _class_private_method_get(this, _method, method);
        _class_private_field_update(b, _method).value++ //Error, not writable 
        ;
    }
}
function method() {}
