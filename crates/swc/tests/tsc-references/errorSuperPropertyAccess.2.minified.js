//// [errorSuperPropertyAccess.ts]
//super property access in constructor of class with no base type
//super property access in instance member function of class with no base type
//super property access in instance member accessor(get and set) of class with no base type
import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _set } from "@swc/helpers/_/_set";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var SomeBase = function() {
    function SomeBase() {
        _class_call_check(this, SomeBase), this.privateMember = 0, this.publicMember = 0;
    }
    var _proto = SomeBase.prototype;
    return _proto.privateFunc = function() {}, _proto.publicFunc = function() {}, SomeBase.privateStaticFunc = function() {}, SomeBase.publicStaticFunc = function() {}, SomeBase;
}();
SomeBase.privateStaticMember = 0, SomeBase.publicStaticMember = 0, super.wat, super.foo();
