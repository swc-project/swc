import _class_private_field_get from "@swc/helpers/lib/_class_private_field_get.js";
import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_method_get from "@swc/helpers/lib/_class_private_method_get.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
var _p1 = /*#__PURE__*/ new WeakMap();
// @strict: true
// @target: esnext, es2022
// @useDefineForClassFields: false
class Foo {
    m1(v) {
        _class_private_field_get(this, _p1).call(this, v);
        v;
    }
    constructor(){
        _class_private_field_init(this, _p1, {
            writable: true,
            value: (v)=>{
                if (typeof v !== "string") {
                    throw new Error();
                }
            }
        });
    }
}
var _p11 = /*#__PURE__*/ new WeakSet();
class Foo2 {
    m1(v) {
        _class_private_method_get(this, _p11, p1).call(this, v);
        v;
    }
    constructor(){
        _class_private_method_init(this, _p11);
    }
}
function p1(v) {
    if (typeof v !== "string") {
        throw new Error();
    }
}
