import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
import _class_private_field_update from "@swc/helpers/lib/_class_private_field_update.js";
import _class_private_method_get from "@swc/helpers/lib/_class_private_method_get.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
import _class_private_field_destructure from "@swc/helpers/lib/_class_private_field_destructure.js";
var _method = /*#__PURE__*/ new WeakSet();
// @target: es2015
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
