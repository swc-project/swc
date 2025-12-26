//// [privateNameStaticMethodAssignment.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
class A3 {
    constructor(a, b){
        var _b, _b1;
        _class_private_field_set(A3, _method, ()=>{}); // Error, not writable 
        _class_private_field_set(a, _method, ()=>{}); // Error, not writable 
        _class_private_field_set(b, _method, ()=>{}); //Error, not writable 
        ({ x: method } = {
            x: ()=>{}
        }); //Error, not writable 
        let x = method;
        _b = b, _b1 = _class_private_field_get(_b, _method), _class_private_field_set(_b, _method, _b1 + (typeof _b1 === "bigint" ? 1n : 1)), _b1; //Error, not writable 
    }
}
function method() {}
