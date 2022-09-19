//// [errorSuperPropertyAccess.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var SomeBase = function() {
    "use strict";
    function SomeBase() {
        _class_call_check(this, SomeBase), this.privateMember = 0, this.publicMember = 0;
    }
    var _proto = SomeBase.prototype;
    return _proto.privateFunc = function() {}, _proto.publicFunc = function() {}, SomeBase.privateStaticFunc = function() {}, SomeBase.publicStaticFunc = function() {}, SomeBase;
}();
SomeBase.privateStaticMember = 0, SomeBase.publicStaticMember = 0, super.wat, super.foo();
