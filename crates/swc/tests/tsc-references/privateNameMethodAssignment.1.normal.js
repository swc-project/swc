//// [privateNameMethodAssignment.ts]
import { _ as _class_private_field_update } from "@swc/helpers/_/_class_private_field_update";
import { _ as _class_private_method_get } from "@swc/helpers/_/_class_private_method_get";
import { _ as _class_private_method_init } from "@swc/helpers/_/_class_private_method_init";
import { _ as _read_only_error } from "@swc/helpers/_/_read_only_error";
import { _ as _class_private_field_destructure } from "@swc/helpers/_/_class_private_field_destructure";
var _method = /*#__PURE__*/ new WeakSet();
class A3 {
    constructor(a, b){
        _class_private_method_init(this, _method);
        this, _read_only_error("#method") // Error, not writable 
        ;
        a, _read_only_error("#method"); // Error, not writable 
        b, _read_only_error("#method") //Error, not writable 
        ;
        ({ x: _class_private_field_destructure(this, _method).value } = {
            x: ()=>{}
        }); //Error, not writable 
        let x = _class_private_method_get(this, _method, method);
        _class_private_field_update(b, _method).value++ //Error, not writable 
        ;
    }
}
function method() {}
