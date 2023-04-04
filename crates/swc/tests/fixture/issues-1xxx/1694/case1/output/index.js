import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _class_private_method_get } from "@swc/helpers/_/_class_private_method_get";
import { _ as _class_private_method_init } from "@swc/helpers/_/_class_private_method_init";
var _get = /*#__PURE__*/ new WeakSet();
var MyClass = function MyClass() {
    "use strict";
    _class_call_check(this, MyClass);
    _class_private_method_init(this, _get);
    _class_private_method_get(this, _get, get).call(this);
};
function get() {
    console.log("Hi from a method with a private identifier called #get");
}
var instance = new MyClass();
