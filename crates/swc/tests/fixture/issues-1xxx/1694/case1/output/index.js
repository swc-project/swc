import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var _get = new WeakSet();
var MyClass = function MyClass() {
    "use strict";
    _class_call_check(this, MyClass);
    _get.add(this);
    get.call(this);
};
function get() {
    console.log("Hi from a method with a private identifier called #get");
}
var instance = new MyClass();
