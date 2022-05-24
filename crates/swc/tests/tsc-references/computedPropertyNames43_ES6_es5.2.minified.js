import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Foo = function() {
    "use strict";
    _class_call_check(this, Foo);
}, Foo2 = function() {
    "use strict";
    _class_call_check(this, Foo2);
}, C = function() {
    "use strict";
    _class_call_check(this, C);
}, D = function(C1) {
    "use strict";
    _inherits(D, C1);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return _create_class(D, [
        {
            key: "get1",
            get: function() {
                return new Foo;
            }
        },
        {
            key: "set1",
            set: function(p) {}
        }
    ]), D;
}(C);
