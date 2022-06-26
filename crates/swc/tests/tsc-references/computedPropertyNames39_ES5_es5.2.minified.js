import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
var Foo = function() {
    "use strict";
    _class_call_check(this, Foo);
}, Foo2 = function() {
    "use strict";
    _class_call_check(this, Foo2);
}, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return _create_class(C, [
        {
            key: 64,
            get: function() {
                return new Foo;
            }
        },
        {
            key: 64,
            set: function(p) {}
        }
    ]), C;
}();
