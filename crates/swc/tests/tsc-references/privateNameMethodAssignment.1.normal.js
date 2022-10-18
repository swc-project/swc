//// [privateNameMethodAssignment.ts]
import _class_private_field_update from "@swc/helpers/src/_class_private_field_update.mjs";
import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
import _read_only_error from "@swc/helpers/src/_read_only_error.mjs";
import _class_private_field_destructure from "@swc/helpers/src/_class_private_field_destructure.mjs";
var _method = /*#__PURE__*/ new WeakSet();
class A3 {
    constructor(a, b){
        _class_private_method_init(this, _method);
        this, _read_only_error("#method") // Error, not writable 
        ;
        a, _read_only_error("#method"); // Error, not writable 
        b, _read_only_error("#method") //Error, not writable 
        ;
        ({ x: _class_private_field_destructure(this, _method).value  } = {
            x: ()=>{}
        }); //Error, not writable 
        let x = _class_private_method_get(this, _method, method);
        _class_private_field_update(b, _method).value++ //Error, not writable 
        ;
    }
}
function method() {}
