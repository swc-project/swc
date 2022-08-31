//// [parserMemberAccessorDeclaration16.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
!function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return _create_class(C, [
        {
            key: "Foo",
            set: function() {
                arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
            }
        }
    ]), C;
}();
