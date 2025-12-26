//// [errorSuperPropertyAccess.ts]
import "@swc/helpers/_/_assert_this_initialized";
import "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import "@swc/helpers/_/_create_class";
import "@swc/helpers/_/_get";
import "@swc/helpers/_/_get_prototype_of";
import "@swc/helpers/_/_inherits";
import "@swc/helpers/_/_set";
var SomeBase = /*#__PURE__*/ function() {
    function SomeBase() {
        _class_call_check(this, SomeBase), this.privateMember = 0, this.publicMember = 0;
    }
    var _proto = SomeBase.prototype;
    return _proto.privateFunc = function() {}, _proto.publicFunc = function() {}, SomeBase.privateStaticFunc = function() {}, SomeBase.publicStaticFunc = function() {}, SomeBase;
}();
SomeBase.privateStaticMember = 0, SomeBase.publicStaticMember = 0, super.wat, super.foo();
