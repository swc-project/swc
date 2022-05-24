import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// @target: es6
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
var Foo2 = function Foo2() {
    "use strict";
    _class_call_check(this, Foo2);
};
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        _class_call_check(this, D);
        return _super.apply(this, arguments);
    }
    _create_class(D, [
        {
            key: "get1",
            get: // Computed properties
            function get() {
                return new Foo;
            }
        },
        {
            key: "set1",
            set: function set(p) {}
        }
    ]);
    return D;
}(C);
