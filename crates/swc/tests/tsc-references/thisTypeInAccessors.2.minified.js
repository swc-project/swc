//// [thisTypeInAccessors.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
!function() {
    "use strict";
    function Explicit() {
        _class_call_check(this, Explicit), this.n = 17;
    }
    return _create_class(Explicit, [
        {
            key: "x",
            get: function() {
                return this.n;
            },
            set: function(n) {
                this.n = n;
            }
        }
    ]), Explicit;
}();
