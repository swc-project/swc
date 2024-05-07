var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _class_private_method_get = require("@swc/helpers/_/_class_private_method_get");
var _class_private_method_init = require("@swc/helpers/_/_class_private_method_init");
var _get = /*#__PURE__*/ new WeakSet();
var MyClass = function MyClass() {
    "use strict";
    _class_call_check._(this, MyClass);
    _class_private_method_init._(this, _get);
    _class_private_method_get._(this, _get, get).call(this);
};
function get() {
    console.log("Hi from a method with a private identifier called #get");
}
var instance = new MyClass();
